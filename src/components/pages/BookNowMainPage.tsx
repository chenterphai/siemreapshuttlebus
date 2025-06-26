"use client"
import React, { useRef, useState } from 'react'
import TextField from "@mui/material/TextField"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { Alert, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Snackbar } from '@mui/material';
import SwapHorizOutlined from "@mui/icons-material/SwapHorizOutlined"
import { Button } from '../ui/button';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import Loading from '@/app/loading';
import { Preloaded, useMutation, usePreloadedQuery, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    // DialogFooter,
    // DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Image from 'next/image';
import Link from 'next/link';
import { Payment } from '@/types/payments';
import { sendMessage } from '@/lib/telegram';
import { isValidEmail } from '@/lib/definitions';

type CustomerInfoType = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    paymentInfo: string;
    specialRequest: string | undefined;
}

const BookNowMainPage = ({
    preloadedPayments
}: {
    preloadedPayments: Preloaded<typeof api.payments.get>
}) => {
    const bookingData = sessionStorage.getItem('TICKET_BOOKING_DATA');

    const today = new Date();

    const payments: Payment[] = usePreloadedQuery(preloadedPayments);

    const mutateTransaction = useMutation(api.transactions.create)

    const departureFrom = useQuery(api.airplane_time.getFrom);
    const departureTo = useQuery(api.airplane_time.getTo);

    const [direction, setDirection] = useState(JSON.parse(bookingData!)?.direction ?? "from");
    const [tranId, setTranId] = useState<string | null>(null);

    // Departure time related state and handlers
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    React.useEffect(() => {
        if (selectedTime === null) {
            if (JSON.parse(bookingData!)) {
                setSelectedTime(JSON.parse(bookingData!).departureTime)
            }
            else if (direction === "from" && departureFrom?.length) {
                setSelectedTime(departureFrom[0].time);
            } else if (direction === "to" && departureTo?.length) {
                setSelectedTime(departureTo[0].time);
            }
        }
    }, [direction, departureFrom, departureTo, selectedTime, bookingData]);

    const handleTimeChange = (date: string | null) => {
        setSelectedTime(date);
    };

    // Return time-related state and handlers
    const [returnTime, setReturnTime] = useState<string | null>(JSON.parse(bookingData!)?.returnTime ?? null);

    const handleChangeReturnTime = (date: string | null) => {
        setReturnTime(date)
    }

    // Departure date related state and handlers
    const [selectedDate, setSelectedDate] = useState<Date | null>(JSON.parse(bookingData!)?.departureDate ? new Date(JSON.parse(bookingData!)?.departureDate) : today);
    const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
    const datePickerRef = useRef(null);

    const handleDateFocus = () => {
        setIsDateOpen(true);
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setIsDateOpen(false);

        // If the return date is earlier than the new departure date, update it
        if (returnDate && date && returnDate < date) {
            setReturnDate(date);
        }
    };

    // Return date related state and handlers
    const [returnDate, setReturnDate] = useState<Date | null>(JSON.parse(bookingData!)?.returnDate ? new Date(JSON.parse(bookingData!)?.returnDate) : today);
    const [isReturnDateOpen, setIsReturnDateOpen] = useState<boolean>(false);
    const returnDatePickerRef = useRef(null);

    const handleReturnDateFocus = () => {
        setIsReturnDateOpen(true);
    };

    const handleReturnDateChange = (date: Date | null) => {
        setReturnDate(date);
        setIsReturnDateOpen(false);
    };

    // Passenger selection state
    const [passager, setPassager] = useState(JSON.parse(bookingData!)?.passager ?? '1');

    const handlePassagerChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassager(event.target.value as string);
    };

    // Payment Method
    const [payment, setPayment] = useState(payments && payments.length > 0 ? payments[0].value : '');

    const handleChangePayment = (event: SelectChangeEvent) => {
        setPayment(event.target.value as string)
    }

    // Trip type selection state
    const [trip, setTrip] = useState(JSON.parse(bookingData!)?.trip ?? 'One Way');

    const handleChangeTrip = (event: SelectChangeEvent) => {
        setTrip(event.target.value as string);

        // When switching to the round trip, initialize the return date and time if needed
        if (event.target.value === 'Round trip' && selectedDate) {
            // Set the return date to at least the departure date
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setReturnDate(nextDay);
        }
    };

    const airport = {
        name: "SR. Int. Airport",
        value: "SAI"
    };
    const siemreap = "Siem Reap Town";
    const [displayDirection, setDisplayDirection] = useState<string>(direction === "from" ? `${airport.name} - ${siemreap}` : `${siemreap} - ${airport.name}`)

    const handleOnSwapChange = () => {
        if (direction === "from") {
            setDirection("to")
            setDisplayDirection(`${siemreap} - ${airport.name}`)
            setSelectedTime(departureTo![0]?.time)
        } else {
            setDirection("from")
            setDisplayDirection(`${airport.name} - ${siemreap}`)
            setSelectedTime(departureFrom![0]?.time)
        }
    }

    // ReCAPTCHA
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState(false);

    async function handleCaptchaSubmission(token: string | null) {
        try {
            if (token) {
                await fetch("/api/recaptcha", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });
                setIsVerified(true);
            }
        } catch (e: unknown) {
            console.error(e)
            setIsVerified(false);
        }
    }

    function onChange(token: string | null) {
        handleCaptchaSubmission(token)
    }

    function handleExpired() {
        setIsVerified(false);
    }

    const [customerInfo, setCustomerInfo] = useState<CustomerInfoType | null>(null)

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [alert, setAlert] = useState(false);
    const [error, setError] = useState('')

    const handleBookNow = async () => {
        if (!selectedTime) {
            setError('Please select departure time.')
            setAlert(true);
            setTimeout(() => { setAlert(false) }, 6000)
            return;
        }

        if (passager <= 0) {
            setError('Passager must be at least 1.')
            setAlert(true);
            setTimeout(() => { setAlert(false) }, 6000)
            return;
        }

        if (!customerInfo?.email || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.phoneNumber) {
            setError('Please fill all fields required.')
            setAlert(true);
            setTimeout(() => { setAlert(false) }, 6000)
            return;
        }

        if (!isValidEmail(customerInfo.email)) {
            setError('Invalid email address.')
            setAlert(true);
            setTimeout(() => { setAlert(false) }, 6000)
            return;
        }

        setIsLoading(true);
        try {

            const orderRef = `SR-${Date.now().toString().slice(-6)}`;
            const departureDate = selectedDate ? `${moment(selectedDate).format("DD MMM YYYY")} / ${selectedTime}` : "";
            const issuedDate = moment(today).format("MMM DD, YYYY");
            const returnDateData = returnDate && trip === "Round trip" ? `${moment(returnDate).format("MMM DD, YYYY")} / ${returnTime}` : "";

            await mutateTransaction({
                order_ref: orderRef,
                departure_date: departureDate,
                email: customerInfo?.email as string,
                name: `${customerInfo?.firstName} ${customerInfo?.lastName}`,
                passager: Number(passager),
                phone: customerInfo?.phoneNumber as string,
                ticket_type: "Bus Ticket",
                total: Number(passager) * 8,
                issued_date: issuedDate,
                special_request: customerInfo?.specialRequest ?? "",
                payment_method: payment,
                return_date: returnDateData,
                trip: trip,
                from: direction === "from" ? airport.value : siemreap,
                to: direction === "from" ? siemreap : airport.value
            }).then(async (res) => {
                setTranId(res)
                // Send email with booking details
                const data = {
                    to: customerInfo?.email,
                    name: `${customerInfo?.firstName} ${customerInfo?.lastName}`,
                    ticketType: "Bus Ticket",
                    phone: customerInfo?.phoneNumber,
                    passager: Number(passager),
                    price: "8",
                    email: customerInfo?.email,
                    detailUrl: res,
                    orderRef: orderRef,
                }

                const response = await axios.post('/api/send', data)

                if (response.data.status.code === 0) {
                    setCustomerInfo(null)
                    setIsSuccess(true)
                    await sendMessage(`${orderRef} - ${customerInfo.firstName} ${customerInfo.lastName} has booked ${passager} bus tickets. Please check details : https://siemreapshuttlebus.netlify.app/booking-detail/${res}`)
                }
            }).catch((err) => {
                console.log(err);
            })

        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <section className='mt-[132px] mb-[100px]' >
            {isLoading && (
                <Loading />
            )}
            <div className='container mx-auto bg-white p-5 rounded-lg'>
                <div className='flex'>
                    <div className='flex flex-col gap-y-2'>
                        <p className='text-xl font-semibold text-neutral-700'>Airport Bus Ticket Booking</p>
                        <div className='h-[3px] bg-primary' />
                    </div>
                </div>
                <div className='mt-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-6 md:grid-cols-2 gap-x-4 gap-y-8'>
                        <div className='col-span-2'>
                            <FormControl fullWidth variant='outlined'>
                                <InputLabel htmlFor="direction">From - To</InputLabel>
                                <OutlinedInput
                                    id='direction'
                                    type='text'
                                    label="From - To"
                                    value={displayDirection}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='swap'
                                                edge="end"
                                                onClick={handleOnSwapChange}
                                            >
                                                <SwapHorizOutlined />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>

                        <div className='relative lg:col-span-1 col-span-2'>
                            <FormControl fullWidth>
                                {departureFrom && departureTo ? (
                                    <>
                                        <InputLabel id="departure-time-select-label">Departure Time</InputLabel>
                                        <Select
                                            labelId="departure-time-select-label"
                                            id="departure-time-select"
                                            value={selectedTime ?? ""}
                                            label="Departure Time"
                                            onChange={(e) => handleTimeChange(e.target.value)}
                                        >
                                            {(direction === 'from') && (
                                                departureFrom ? (
                                                    departureFrom.map((item, index) => (
                                                        <MenuItem key={index} value={item.time}>
                                                            {item.time}
                                                        </MenuItem>
                                                    ))) : (<div className='flex justify-center items-center py-4'>
                                                        <CircularProgress size={20} />
                                                    </div>
                                                )
                                            )}

                                            {(direction === 'to') && (
                                                departureTo ? (
                                                    departureTo.map((item, index) => (
                                                        <MenuItem key={index} value={item.time}>
                                                            {item.time}
                                                        </MenuItem>
                                                    ))) : (<div className='flex justify-center items-center py-4'>
                                                        <CircularProgress size={20} />
                                                    </div>
                                                )
                                            )}
                                        </Select>
                                    </>
                                ) : (
                                    <>
                                        <TextField
                                            id="departure-time-select"
                                            disabled
                                            label="Departure Time"
                                            onChange={(e) => handleTimeChange(e.target.value)}
                                            value={moment(today).format("HH:mm A")}
                                        />
                                        <CircularProgress className='absolute top-4 right-4' size={20} />

                                    </>
                                )}
                            </FormControl>


                        </div>
                        <div className='relative lg:col-span-1 col-span-2'>
                            <TextField
                                required
                                label="Departure Date"
                                className='w-full'
                                id="departure-date-field"
                                onFocus={handleDateFocus}
                                value={selectedDate ? moment(selectedDate).format("DD MMM YYYY") : ""}
                                InputProps={{ readOnly: true }}
                            />
                            {isDateOpen && (
                                <div className='absolute left-1/2 top-8 z-10'>
                                    <DatePicker
                                        selected={selectedDate}
                                        className='hidden'
                                        onChange={(date) => handleDateChange(date)}
                                        timeIntervals={15}
                                        ref={datePickerRef}
                                        open={true}
                                        onClickOutside={() => setIsDateOpen(false)}
                                        minDate={today}
                                    />
                                </div>
                            )}
                        </div>

                        <div className='grid grid-cols-2 col-span-2 gap-4'>
                            <div>
                                {/* <FormControl fullWidth>
                                     <InputLabel id="passenger-select-label">No. Passager</InputLabel>
                                    <Select
                                        labelId="passenger-select-label"
                                        id="passenger-select"
                                        value={passager}
                                        label="No. Passager"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'1'}>1 passager</MenuItem>
                                        <MenuItem value={'2'}>2 passagers</MenuItem>
                                        <MenuItem value={'3'}>3 passagers</MenuItem>
                                    </Select>
                                </FormControl> */}
                                <FormControl sx={{}} variant="outlined">
                                    <InputLabel id="passenger-select-label">No. Passager</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-passager"
                                        label="No. Passager"
                                        endAdornment={(parseInt(passager) > 0 && parseInt(passager) < 2) ? <InputAdornment position="end" >passager</InputAdornment> : parseInt(passager) > 1 ? <InputAdornment position="end" >passagers</InputAdornment> : <></>}
                                        aria-describedby="outlined-passager-helper-text"
                                        inputProps={{
                                            'aria-label': 'passager',
                                        }}
                                        value={passager}
                                        onChange={(e) => handlePassagerChange(e)}
                                    />
                                </FormControl>
                            </div>

                            <div>
                                <FormControl fullWidth>
                                    <InputLabel id="trip-select-label">Trip</InputLabel>
                                    <Select
                                        labelId="trip-select-label"
                                        id="trip-select"
                                        value={trip}
                                        label="Trip"
                                        onChange={handleChangeTrip}
                                    >
                                        <MenuItem value={'One Way'}>One Way</MenuItem>
                                        <MenuItem value={'Round trip'}>Round trip</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                        </div>
                        {trip === "Round trip" && (
                            <>
                                <div className='relative col-span-2'>
                                    <TextField
                                        required
                                        label="Return Date"
                                        className='w-full'
                                        id="return-date-field"
                                        onFocus={handleReturnDateFocus}
                                        value={returnDate ? moment(returnDate).format("DD MMM YYYY") : ""}
                                        InputProps={{ readOnly: true }}
                                    />
                                    {isReturnDateOpen && (
                                        <div className='absolute left-1/2 top-8 z-10'>
                                            <DatePicker
                                                selected={returnDate}
                                                className='hidden'
                                                onChange={(date) => handleReturnDateChange(date)}
                                                timeIntervals={15}
                                                ref={returnDatePickerRef}
                                                open={true}
                                                onClickOutside={() => setIsReturnDateOpen(false)}
                                                minDate={selectedDate || today}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className='relative lg:col-span-1 col-span-2'>
                                    <FormControl fullWidth>
                                        {departureTo ? (
                                            <>
                                                <InputLabel id="return-time-select-label">Return Time</InputLabel>
                                                <Select
                                                    labelId="return-time-select-label"
                                                    id="departure-time-select"
                                                    value={returnTime ?? departureTo[0].time}
                                                    label="Departure Time"
                                                    onChange={(e) => handleChangeReturnTime(e.target.value)}
                                                >
                                                    {
                                                        departureTo.map((item, index) => (
                                                            <MenuItem key={index} value={item.time}>
                                                                {item.time}
                                                            </MenuItem>
                                                        )
                                                        )
                                                    }
                                                </Select>
                                            </>
                                        ) : (
                                            <>
                                                <TextField
                                                    id="return-time-select"
                                                    disabled
                                                    label="Return Time"
                                                    onChange={(e) => handleTimeChange(e.target.value)}
                                                    value={moment(today).format("HH:mm A")}
                                                />
                                                <CircularProgress className='absolute top-4 right-4' size={20} />

                                            </>
                                        )}
                                    </FormControl>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className='mt-14'>
                    <div className='flex'>
                        <div className='flex flex-col gap-y-2'>
                            <p className='text-xl font-medium text-neutral-700'>Personal Information</p>
                            {/* <div className='h-[3px] bg-primary' /> */}
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-x-4 gap-y-8 mt-4'>
                        <TextField
                            required
                            label="First name"
                            type='text'
                            error={!customerInfo?.lastName}
                            id='firstname'
                            value={customerInfo?.firstName ?? ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (customerInfo) {
                                    setCustomerInfo({ ...customerInfo, firstName: e.target.value });
                                } else {
                                    setCustomerInfo({
                                        firstName: e.target.value,
                                        lastName: '',
                                        email: '',
                                        phoneNumber: '',
                                        paymentInfo: '',
                                        specialRequest: ''
                                    });
                                }
                            }}
                        />


                        <TextField
                            required
                            label="Last name"
                            type='text'
                            id='lastname'
                            error={!customerInfo?.lastName}
                            value={customerInfo?.lastName ?? ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (customerInfo) {
                                    setCustomerInfo({ ...customerInfo, lastName: e.target.value });
                                } else {
                                    setCustomerInfo({
                                        firstName: '',
                                        lastName: e.target.value,
                                        email: '',
                                        phoneNumber: '',
                                        paymentInfo: '',
                                        specialRequest: ''
                                    });
                                }
                            }}
                        />

                        <TextField
                            required
                            label="Email"
                            type='email'
                            error={!customerInfo?.email}
                            className='md:col-span-1 col-span-2'
                            value={customerInfo?.email ?? ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (customerInfo) {
                                    setCustomerInfo({ ...customerInfo, email: e.target.value });
                                } else {
                                    setCustomerInfo({
                                        firstName: '',
                                        lastName: '',
                                        email: e.target.value,
                                        phoneNumber: '',
                                        paymentInfo: '',
                                        specialRequest: ''
                                    });
                                }
                            }}
                        />
                        <TextField
                            required
                            label="Phone Number"
                            type='text'
                            error={!customerInfo?.phoneNumber}
                            className='md:col-span-1 col-span-2'
                            value={customerInfo?.phoneNumber ?? ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (customerInfo) {
                                    setCustomerInfo({ ...customerInfo, phoneNumber: e.target.value });
                                } else {
                                    setCustomerInfo({
                                        firstName: '',
                                        lastName: '',
                                        email: '',
                                        phoneNumber: e.target.value,
                                        paymentInfo: '',
                                        specialRequest: ''
                                    });
                                }
                            }}
                        />
                        <FormControl fullWidth className='md:col-span-1 col-span-2'>
                            <InputLabel id="payment-select-label">Payment Method</InputLabel>
                            <Select
                                labelId="payment-select-label"
                                id="payment-select"
                                value={payment}
                                label="Payment Method"
                                onChange={handleChangePayment}
                            >
                                {payments && payments.map((item) => (
                                    <MenuItem key={item._id} value={item.value}>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className='col-span-2'>
                            <TextField
                                type='text'
                                label="Special Request (optional)"
                                className='w-full'
                                multiline
                                id='special-request'
                                placeholder='Ex: I need a bottle of water'
                                maxRows={4}
                                value={customerInfo?.specialRequest ?? ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (customerInfo) {
                                        setCustomerInfo({ ...customerInfo, specialRequest: e.target.value });
                                    } else {
                                        setCustomerInfo({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            phoneNumber: '',
                                            paymentInfo: '',
                                            specialRequest: e.target.value
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className='mt-6 grid lg:grid-cols-6 grid-cols-1 gap-4'>
                    <div className='grid lg:grid-cols-3 grid-cols-1 items-center gap-3 lg:col-span-5'>
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            ref={recaptchaRef}
                            onChange={onChange}
                            onExpired={handleExpired}
                        />
                    </div>
                    <div className=''>

                        <Button className='h-12 w-full rounded cursor-pointer' disabled={!isVerified} onClick={handleBookNow}>
                            Book Now
                        </Button>

                    </div>
                </div>
            </div>
            <Dialog modal open={isSuccess} onOpenChange={setIsSuccess}>
                <DialogTitle>
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col items-center justify-center'>
                        <Image
                            src="/email-tick.svg"
                            alt='Success Booking'
                            width={50}
                            height={50}
                            loading='lazy'
                        />
                        <p className='md:text-xl text-center text-lg font-medium text-neutral-700 mt-4'>
                            Your booking has been confirmed!
                        </p>
                        <p className='text-sm text-neutral-500 mt-2 text-center'>
                            Check your email for detail and bring <br /> confirmation number upon arrival.
                        </p>
                        <div className='mt-6 flex items-center gap-x-4'>
                            <Link href={`/booking-detail/${tranId}`} passHref>
                                <Button className='h-10 px-5 rounded cursor-pointer bg-neutral-100 text-neutral-500 hover:bg-neutral-200' onClick={() => setCustomerInfo(null)}>
                                    View Detail
                                </Button>
                            </Link>

                            <Button className='h-10 px-8 rounded cursor-pointer' onClick={() => setIsSuccess(false)}>
                                Done
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={alert}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity='error' variant='filled' sx={{ width: "100%" }}>{error}</Alert>
            </Snackbar>
        </section>
    )
}

export default BookNowMainPage