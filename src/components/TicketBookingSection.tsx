"use client"
import React, { useRef, useState } from 'react'
import TextField from "@mui/material/TextField"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import {
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent
} from '@mui/material';
import Image from 'next/image';
import { Button } from './ui/button';
import SwapHorizOutlined from "@mui/icons-material/SwapHorizOutlined"
import { useRouter } from 'next/navigation';

interface Departure {
    _creationTime: number;
    _id: string;
    from_town: boolean;
    time: string;
}

const TicketBookingSection = ({
    departureFrom,
    departureTo
}: {
    departureFrom: Departure[],
    departureTo: Departure[],
}) => {
    const today = new Date();
    const [direction, setDirection] = useState("from");
    const [bookingData, setBookingData] = useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const storedData = sessionStorage.getItem('TICKET_BOOKING_DATA');
        if (storedData) {
            try {
                setBookingData(storedData);
            } catch (error) {
                console.error('Error parsing booking data:', error);
            }
        }
    }, []);

    // Departure time related state and handlers
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    React.useEffect(() => {
        if (bookingData) {
            setSelectedTime(JSON.parse(bookingData!).departureTime)
        }
    }, [bookingData]);

    React.useEffect(() => {
        if (direction === "from" && departureFrom?.length) {
            if (!selectedTime || !departureFrom.some((item) => item.time === selectedTime)) {
                if (departureFrom[0]?.time) {
                    setSelectedTime(departureFrom[0].time);
                }
            }
        } else if (direction === "to" && departureTo?.length) {
            if (!selectedTime || !departureTo.some((item) => item.time === selectedTime)) {
                if (departureTo[0]?.time) {
                    setSelectedTime(departureTo[0].time);
                }
            }
        }
    }, [departureFrom, departureTo, direction, selectedTime]);

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

    // Trip type selection state
    const [trip, setTrip] = useState(JSON.parse(bookingData!)?.trip ?? 'One Way');

    const handleChangeTrip = (event: SelectChangeEvent) => {
        setTrip(event.target.value as string);
    };

    const airport = "SR. Int. Airport";
    const siemreap = "Siem Reap Town";
    const [displayDirection, setDisplayDirection] = useState<string>(direction === "from" ? `${airport} - ${siemreap}` : `${siemreap} - ${airport}`)

    const handleOnSwapChange = () => {
        if (direction === "from") {
            setDirection("to")
            setDisplayDirection(`${siemreap} - ${airport}`)
        } else {
            setDirection("from")
            setDisplayDirection(`${airport} - ${siemreap}`)
        }
    }

    const handleBookNow = () => {
        const postData = {
            direction: direction,
            passager: passager,
            departureTime: selectedTime,
            departureDate: selectedDate,
            trip: trip,
            returnTime: returnTime,
            returnDate: returnDate
        }

        sessionStorage.setItem('TICKET_BOOKING_DATA', JSON.stringify(postData));
        router.push('/book-ticket');
    }

    return (
        <section className='mt-[132px]' >
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
                <div className='mt-6 grid lg:grid-cols-6 grid-cols-1 gap-4'>
                    <div className='grid lg:grid-cols-3 grid-cols-1 items-center gap-3 lg:col-span-5'>
                        <div className='flex items-center gap-1.5'>
                            <Image
                                src="/bus2.svg"
                                alt='Bus 2'
                                width={20}
                                height={20}
                                loading='lazy'
                            />
                            <span className='text-xs text-neutral-500'>Journey duration is 1 hrs 0 mins.</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <Image
                                src="/clock.svg"
                                alt='Bus 2'
                                width={18}
                                height={18}
                                loading='lazy'
                            />
                            <span className='text-xs text-neutral-500'>First bus is at 05:30 & last bus is at 19:00.</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                            <Image
                                src="/dollar.svg"
                                alt='Bus 2'
                                width={18}
                                height={18}
                                loading='lazy'
                            />
                            <span className='text-xs text-neutral-500'>Price starts from USD 8.</span>
                        </div>
                    </div>
                    <div className=''>

                        <Button className='h-12 w-full rounded cursor-pointer' onClick={handleBookNow}>
                            Book Now
                        </Button>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default TicketBookingSection