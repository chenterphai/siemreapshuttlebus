// import { EmailTemplate } from "@/components/EmailTemplate";
import moment from "moment";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import EmailTemplateTransportation from "../../../../emails/booking-transport";
// import PapermarkYearInReviewEmail from "@/emails/booking-ticket/test";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    const { to, name, passager, phone, price, ticketType } = requestData;

    if (!to || !name || !passager || !phone || !price || !ticketType) {
      return NextResponse.json(
        { error: "Recipient email(s) are required and must be an array" },
        { status: 400 }
      );
    }

    const today = new Date();
    const cambodiaDate = new Date(
      today.toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" })
    );

    const total = Number(price);

    const { data, error } = await resend.emails.send({
      from: "no-reply <khonkhen@siemreapshuttlebus.com>",
      to: [requestData.to],
      subject: `Siem Reap Shuttle Bus Booking Confirmation #${requestData.orderRef}`,
      react: EmailTemplateTransportation({
        name: requestData.name || "John",
        email: requestData.to,
        issuedDate: moment(cambodiaDate).format("MMM DD, YYYY HH:mm:ss"),
        passager: requestData.passager,
        phone: requestData.phone,
        price: requestData.price,
        ticketType: requestData.ticketType,
        total: total.toString(),
        orderRef: requestData.orderRef,
        detailUrl: requestData.detailUrl,
        imageUrl: requestData.imageUrl,
      }),
      cc: ["support@siemreapshuttlebus.com", "khonkhen@siemreapshuttlebus.com"],
    });

    if (error) {
      return NextResponse.json(
        {
          code: 1,
          msg: "Something went wrong",
          status: "error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: {
        code: 0,
        status: "success",
        msg: "Successfully booked!",
      },
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 1,
        error,
      },
      { status: 500 }
    );
  }
}
