import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/firebase/client"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

const CustomerFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 ký tự")
    .max(20, "Số điện thoại không được vượt quá 20 ký tự"),
  serviceName: z
    .string()
    .min(1, "Vui lòng chọn dịch vụ")
    .max(200, "Tên dịch vụ không được vượt quá 200 ký tự"),
})

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = CustomerFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const { fullName, email, phoneNumber, serviceName } = parsed.data

    const id = `CUS-${Date.now()}`

    await setDoc(doc(collection(db, "customers"), id), {
      fullName,
      email,
      phoneNumber,
      serviceName,
      createdAt: serverTimestamp(),
    })

    // Gửi thông báo đến Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (botToken && chatId) {
      const message = [
        "📬 *Liên hệ mới từ khách hàng*",
        "",
        `👤 *Họ tên:* ${fullName}`,
        `📧 *Email:* ${email}`,
        `📞 *SĐT:* ${phoneNumber}`,
        `🛎️ *Dịch vụ:* ${serviceName}`,
      ].join("\n")

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
          }),
        }
      )

      if (!telegramResponse.ok) {
        const errorText = await telegramResponse.text()
        console.error("[Telegram API Error]", errorText)
      }
    } else {
      console.warn(
        "[Contact API] Telegram env vars missing - skip notification"
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Gửi thông tin thành công!",
        id,
      },
      { status: 201, headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error("[Contact API Error]", error)

    return NextResponse.json(
      {
        success: false,
        message: "Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại.",
      },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
