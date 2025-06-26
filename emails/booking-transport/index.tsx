// import Image from 'next/image';
import {
    Head,
    Html,
    Img,
    Link,
    Text,
    Container,
    Section,
    Body,
    Row,
    Column,
    Hr, Tailwind,
    Preview
} from "@react-email/components";

interface EmailTemplateProps {
    name?: string;
    total?: string;
    issuedDate?: string;
    ticketType?: string;
    price?: string;
    passager?: string;
    phone?: string;
    email?: string;
    orderRef?: string;
    detailUrl?: string;
    imageUrl?: string;
}


// const imageUrl = "http://localhost:3000"
const imageUrlBase = "https://siemreapshuttlebus.netlify.app"

export default function EmailTemplateTransportation({
    name,
    total,
    issuedDate,
    ticketType,
    price,
    passager,
    phone,
    email,
    orderRef,
    detailUrl,
    imageUrl
}: EmailTemplateProps) {
    return (
        <Html>
            <Head />
            <Preview>Siem Reap Shuttle Booking Confirmation!</Preview>
            <Tailwind>
                <Body className="font-sans bg-white">
                    <Container style={container}>
                        <Section style={header}>
                            <Row width={130} align='left'>
                                <Column align="left">
                                    <Img
                                        src={`${imageUrlBase}/_logo.png`}
                                        alt='Logo'
                                        width="521"
                                        height="300"
                                        loading="lazy"
                                        className="w-full h-auto -ms-2"
                                    />
                                </Column>
                            </Row>
                            <Section>
                                {/* <Text style={{ fontSize: 24, fontWeight: "bold", textTransform: "uppercase", color: "#0F75BC" }}>Siem Reap Shuttle Bus</Text> */}
                                <Text style={{ fontSize: 18, color: "#FFFFFF", fontWeight: "700" }} className="leading-none" >Booking Confirmation!</Text>
                            </Section>
                            <Section>
                                <Text className="text-[#FFFFFF] font-semibold text-lg leading-none mb-1">Hello {name},</Text>
                                <Text className="text-white leading-none mt-1.5">Your booking is successfully complete!</Text>
                            </Section>

                            <Section>
                                <Text className="font-medium text-sm leading-none text-white mb-1">Order Ref:</Text>
                                <Text className="font-semibold text-white leading-none text-xl mt-1.5">{orderRef}</Text>
                            </Section>
                        </Section>

                        <Section style={{ padding: 16, }} >
                            <Row>
                                <Column colSpan={2}>
                                    <Text className="text-base text-neutral-500 font-normal leading-none">TOTAL</Text>
                                    <Text className="text-lg text-[#1C6AE4] leading-none font-semibold mt-1">${parseFloat(total!).toFixed(2)}</Text>
                                </Column>
                                <Column>
                                    <Text className="text-base text-neutral-500 font-normal leading-none">Issued Date</Text>
                                    <Text className="text-lg text-neutral-600 font-medium leading-none mt-1">{issuedDate}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr />

                        <Section style={{ padding: 14 }}>
                            <Text className="text-xl leading-none font-semibold text-neutral-700 mt-0 mb-0">Your Booking</Text>
                            <Section>

                                <Row align='left' className="mt-4">

                                    <Column width={60} height={50} align='left'>
                                        <Img
                                            src={imageUrl}
                                            width="256"
                                            height="256"
                                            alt="Ticket"
                                            loading="lazy"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </Column>
                                    <Column colSpan={2}>
                                        <Section style={{ marginLeft: 12 }}>
                                            <Text className="text-base text-neutral-600 font-medium leading-none mb-0 mt-0">{ticketType}</Text>
                                            <Link href={`${process.env.NEXT_PUBLIC_BOOKING_DETAIL_URL}/${detailUrl}`} className="text-xs font-normal leading-none underline mt-1.5" >
                                                Detail
                                            </Link>
                                        </Section>
                                    </Column>
                                    <Column align='right'>
                                        <Row>
                                            <Column align='right'>
                                                <Text className="text-neutral-500 leading-none font-medium text-sm">{passager}</Text>
                                            </Column>
                                            <Column align='right'>
                                                <Text className="text-neutral-500 leading-none font-medium text-sm">Pax</Text>
                                            </Column>
                                            <Column align='right'>
                                                <Text className="text-neutral-500 leading-none font-medium text-base">${parseFloat(price!).toFixed(2)}</Text>
                                            </Column>
                                        </Row>
                                    </Column>
                                </Row>

                            </Section>
                        </Section>

                        <Hr />


                        <Section style={{ padding: 14 }}>
                            <Row>
                                <Column>
                                    <Text className="text-neutral-400 leading-none text-base mb-0 mt-0">Subtitle:</Text>
                                </Column>
                                <Column align='right'>
                                    <Text className="text-base text-neutral-600 leading-none mb-0 mt-0">${parseFloat(total!).toFixed(2)}</Text>
                                </Column>
                            </Row>
                            <Row>
                                <Column>
                                    <Section>
                                        <Row>
                                            <Column width={50}>
                                                <Text className="text-base font-medium mb-0 leading-none text-neutral-600 mt-1.5">Total: </Text>
                                            </Column>
                                            <Column>
                                                <Text className="text-sm text-neutral-400 leading-none mt-1.5 mb-0">(Including VAT)</Text>
                                            </Column>
                                        </Row>
                                    </Section>
                                </Column>
                                <Column align='right'>
                                    <Text className="text-base text-neutral-800 mb-0 font-semibold mt-1.5">${parseFloat(total!).toFixed(2)}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr />

                        <Section style={{ padding: 14 }}>
                            <Text className="text-xl leading-none font-semibold text-neutral-700 mt-0">Customer Information</Text>

                            <Section style={{ marginTop: 24 }}>
                                <Row align='left'>
                                    <Column align='left'>
                                        <Section align='left'>
                                            <Row>
                                                <Column align='left' width={40}>
                                                    <Container className="bg-[#1C6AE410] rounded-full px-3 py-3" width={40} align="left">
                                                        <Img
                                                            src={`${imageUrlBase}/user.png`}
                                                            width="16"
                                                            height="16"
                                                            alt='Username'
                                                        />
                                                    </Container>
                                                </Column>
                                                <Column align="left">
                                                    <Text className="text-xs text-left leading-none my-0 text-neutral-400 ml-2.5">Name</Text>
                                                    <Text className="text-sm text-left text-neutral-600 mb-0 mt-0.5 ml-2.5 line-clamp-1 flex-1">{name}</Text>
                                                </Column>
                                            </Row>
                                        </Section>
                                    </Column>
                                    <Column>
                                        <Section>
                                            <Row>
                                                <Column align='left' width={40}>
                                                    <Container className="bg-[#1C6AE410] rounded-full px-3 py-3">
                                                        <Img
                                                            src={`${imageUrlBase}/phone.png`}
                                                            width="16"
                                                            height="16"
                                                            alt='Phone'
                                                        />
                                                    </Container>
                                                </Column>
                                                <Column>
                                                    <Text className="text-xs leading-none my-0 text-neutral-400 ml-2.5">Phone Number</Text>
                                                    <Link href={`tel:${phone}`} className="text-sm leading-none mb-0 mt-0.5 ml-2.5 underline">{phone}</Link>
                                                </Column>
                                            </Row>
                                        </Section>
                                    </Column>
                                </Row>

                                <Row style={{ paddingTop: 16 }}>
                                    <Column align='left'>
                                        <Section align='left'>
                                            <Row align='left'>
                                                <Column align='left' width={40}>
                                                    <Container className="bg-[#1C6AE410] rounded-full px-3 py-3" >
                                                        <Img
                                                            src={`${imageUrlBase}/email.png`}
                                                            width={16}
                                                            height={16}
                                                            alt='email'
                                                        />
                                                    </Container>
                                                </Column>
                                                <Column>
                                                    <Text className="text-xs leading-none my-0 text-neutral-400 ml-2.5">Email</Text>
                                                    <Link href={`mailto:${email}`} className="text-sm leading-none mb-0 mt-0.5 ml-2.5 underline">{email}</Link>
                                                </Column>
                                            </Row>
                                        </Section>
                                    </Column>
                                </Row>
                            </Section>
                        </Section>

                        <Hr />

                        <Section style={{ padding: 14 }}>
                            <Text className="text-xl leading-none font-semibold text-neutral-700 mt-0">Support</Text>
                            <Section style={{ marginTop: 24 }} >
                                <Row align='left'>
                                    <Column align='left'>
                                        <Section align='left'>
                                            <Row align='left'>
                                                <Column align='left' width={40}>
                                                    <Container className="bg-[#1C6AE410] rounded-full px-3 py-3">
                                                        <Img
                                                            src={`${imageUrlBase}/email.png`}
                                                            width={16}
                                                            height={16}
                                                            alt='Our Email'
                                                        />
                                                    </Container>
                                                </Column>
                                                <Column>
                                                    <Text className="text-xs leading-none my-0 text-neutral-400 ml-2.5">Phone</Text>
                                                    <Text className="text-sm leading-none text-neutral-700 mb-0 mt-1 ml-2.5">097 268 08 58 / 085 86 1424</Text>
                                                </Column>
                                            </Row>
                                        </Section>
                                    </Column>
                                </Row>

                                <Row style={{ paddingTop: 16 }}>
                                    <Column>
                                        <Section>
                                            <Row>
                                                <Column align='left' width={40}>
                                                    <Container className="bg-[#1C6AE410] rounded-full px-3 py-3">
                                                        <Img
                                                            src={`${imageUrlBase}/phone.png`}
                                                            width={16}
                                                            height={16}
                                                            alt='Phone'
                                                        />
                                                    </Container>
                                                </Column>
                                                <Column>
                                                    <Text className="text-xs leading-none my-0 text-neutral-400 ml-2.5">Email</Text>
                                                    <Link href={`mailto:khonkhen@siemreapshuttlebus.com`} className="text-sm leading-none underline mb-0 mt-1 ml-2.5">khonkhen@siemreapshuttlebus.com</Link>
                                                </Column>
                                            </Row>
                                        </Section>
                                    </Column>
                                </Row>
                            </Section>
                        </Section>
                    </Container>
                    <Container>
                        <Section style={{ padding: 14 }}>
                            <Text className="text-center">&copy; Copyright 2025 - SiemReapShuttleBus</Text>
                            <Row align="left">
                                <Column align="center">
                                    <Link href="https://siemreapshuttlebus/terms-condition" className='text-sm text-center'>Terms & Conditions</Link>
                                </Column>
                                {/* <Column align="center">
                                    <Link href="https://siemreapshuttlebus/privacy-policy" className='text-sm text-center'>Privacy Policy</Link>
                                </Column> */}
                            </Row>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
};

EmailTemplateTransportation.PreviewProps = {
    name: "Chenter PHAI",
    total: "35",
    issuedDate: "May 22, 2025 20:00",
    ticketType: "VIP Supercar",
    price: "35",
    passager: '2-5',
    phone: "0964903404",
    email: "chenterphai@gmail.com",
    orderRef: "SR-123456",
    imageUrl: "https://warmhearted-goose-69.convex.cloud/api/storage/3fa58f6a-18d5-4880-93c5-603ef3d2a149"
} satisfies EmailTemplateProps;


const header = {
    background: 'linear-gradient(to top left, #1C6AE480, #1C6AE460, #1C6AE440)',
    padding: 16
};


const container = {
    overflow: "hidden",
    marginBottom: 12,
    borderRadius: 20,
    border: "1px solid #E5E7EB",
}