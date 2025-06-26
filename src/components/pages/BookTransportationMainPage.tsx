"use client";

import React, { useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import {
  Alert,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import SwapHorizOutlined from "@mui/icons-material/SwapHorizOutlined";
import { Button } from "../ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { TransportationType } from "@/components/PrivateTransportationServiceSection";
import Loading from "@/app/loading";
import axios from "axios";
import { Payment } from "@/types/payments";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import Link from "next/link";
import { sendMessage } from "@/lib/telegram";
import { isValidEmail } from "@/lib/definitions";

type CustomerInfoType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  paymentInfo: string;
  specialRequest: string | undefined;
};

const BookTransportationMainPage = ({
  preloadedTransportation,
  preloadedPayment,
}: {
  preloadedTransportation: Preloaded<typeof api.transportation.select>;
  preloadedPayment: Preloaded<typeof api.payments.get>;
}) => {
  const transportation: TransportationType = usePreloadedQuery(
    preloadedTransportation
  );
  const payments: Payment[] = usePreloadedQuery(preloadedPayment);
  const mutateTransaction = useMutation(api.transactions.create);
  // const departureFrom = useQuery(api.airplane_time.getFrom);
  // const departureTo = useQuery(api.airplane_time.getTo);

  const [direction, setDirection] = useState("from");
  const [tranId, setTranId] = useState<string | null>(null);

  const today = new Date();

  // React.useEffect(() => {

  //     if (direction === "from" && departureFrom?.length) {
  //         setSelectedTime(departureFrom[0].time);
  //     } else if (direction === "to" && departureTo?.length) {
  //         setSelectedTime(departureTo[0].time);
  //     }

  // }, [direction, departureFrom, departureTo]);
  // Departure time related state and handlers
  const [selectedTime, setSelectedTime] = useState<Date | null>(today);
  const [isTimeOpen, setIsTimeOpen] = useState<boolean>(false);
  const handleTimeFocus = () => {
    setIsTimeOpen(true);
  };
  const handleTimeChange = (date: Date | null) => {
    setSelectedTime(date);
    setIsTimeOpen(false);
  };

  // Return time related state and handlers
  const [returnTime, setReturnTime] = useState<Date | null>(today);
  const [isReturnTimeOpen, setIsReturnTimeOpen] = useState<boolean>(false);
  const handleReturnTimeFocus = () => {
    setIsReturnTimeOpen(true);
  };
  const handleChangeReturnTime = (date: Date | null) => {
    setReturnTime(date);
    setIsReturnTimeOpen(false);
  };

  // Departure date related state and handlers
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
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
  // const numberOfDays = useMemo(() => {
  //     if (startDate && endDate) {
  //         const diff = Math.ceil(
  //             Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  //         );
  //         return diff === 0 ? 1 : diff;
  //     }
  //     if (startDate && !endDate) {
  //         return 1;
  //     }
  //     return null;
  // }, [startDate, endDate]);

  // Return date related state and handlers
  const [returnDate, setReturnDate] = useState<Date | null>(today);
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
  const [passager, setPassager] = useState("1");

  const handlePassagerChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassager(event.target.value as string);
  };

  // Payment Method
  const [payment, setPayment] = useState(
    payments && payments.length > 0 ? payments[0].value : ""
  );

  const handleChangePayment = (event: SelectChangeEvent) => {
    setPayment(event.target.value as string);
  };

  // Trip type selection state
  const [trip, setTrip] = useState("One Way");

  const handleChangeTrip = (event: SelectChangeEvent) => {
    setTrip(event.target.value as string);

    // When switching to the round trip, initialize the return date and time if needed
    if (event.target.value === "Round trip" && selectedDate) {
      // Set the return date to at least the departure date
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setReturnDate(nextDay);
    }
  };
  const airport = {
    name: "SR. Int. Airport",
    value: "SAI",
  };
  const siemreap = "Siem Reap Town";
  const [displayDirection, setDisplayDirection] = useState<string>(
    `${airport.name} - ${siemreap}`
  );

  const handleOnSwapChange = () => {
    if (direction === "from") {
      setDirection("to");
      setDisplayDirection(`${siemreap} - ${airport.name}`);
      // setSelectedTime(departureTo![0]?.time)
    } else {
      setDirection("from");
      setDisplayDirection(`${airport.name} - ${siemreap}`);
      // setSelectedTime(departureFrom![0]?.time)
    }
  };

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
      console.error(e);
      setIsVerified(false);
    }
  }

  function onChange(token: string | null) {
    handleCaptchaSubmission(token);
  }

  function handleExpired() {
    setIsVerified(false);
  }

  const [customerInfo, setCustomerInfo] = useState<CustomerInfoType | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("");

  const handleBookNow = async () => {
    if (
      !customerInfo?.email ||
      !customerInfo.firstName ||
      !customerInfo.lastName ||
      !customerInfo.phoneNumber
    ) {
      setError("Please fill all fields required.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 6000);
      return;
    }

    if (!isValidEmail(customerInfo.email)) {
      setError("Invalid email address.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 6000);
      return;
    }

    if (Number(passager) <= 0) {
      setError("Passager must be at least 1.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 6000);
      return;
    }

    setIsLoading(true);
    try {
      const orderRef = `SR-${Date.now().toString().slice(-6)}`;
      const departureDate = selectedDate
        ? `${moment(selectedDate).format("DD MMM YYYY")} / ${moment(selectedTime).format("HH:mm A")}`
        : "";
      const issuedDate = moment(today).format("MMM DD, YYYY");
      const returnDateData =
        returnDate && trip === "Round trip"
          ? `${moment(returnDate).format("MMM DD, YYYY")} / ${moment(returnTime).format("HH:mm A")}`
          : "";

      await mutateTransaction({
        order_ref: orderRef,
        departure_date: departureDate,
        email: customerInfo?.email as string,
        name: `${customerInfo?.firstName} ${customerInfo?.lastName}`,
        passager: Number(passager),
        phone: customerInfo?.phoneNumber as string,
        ticket_type: transportation.title,
        total: Number(transportation.price) * (trip === "Round trip" ? 2 : 1),
        issued_date: issuedDate,
        special_request: customerInfo?.specialRequest ?? "",
        payment_method: payment,
        return_date: returnDateData,
        trip: trip,
        from: direction === "from" ? airport.value : siemreap,
        to: direction === "from" ? siemreap : airport.value,
      })
        .then(async (res) => {
          setTranId(res);
          // Send email with booking details
          const data = {
            to: customerInfo?.email,
            name: `${customerInfo?.firstName} ${customerInfo?.lastName}`,
            ticketType: transportation.title,
            phone: customerInfo?.phoneNumber,
            passager: Number(passager),
            price:
              Number(transportation.price) * (trip === "Round trip" ? 2 : 1),
            email: customerInfo?.email,
            detailUrl: res,
            orderRef: orderRef,
            imageUrl: transportation.url,
          };

          const response = await axios.post("/api/transport", data);

          if (response.data.status.code === 0) {
            setCustomerInfo(null);
            setIsSuccess(true);
            await sendMessage(
              `${orderRef} - ${customerInfo.firstName} ${customerInfo.lastName} has booked your private transportation services. Please check detail. https://siemreapshuttlebus.netlify.app/booking-detail/${res}`
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-[132px] mb-[100px]">
      {isLoading && <Loading />}
      <div className="container mx-auto bg-white p-5 max-sm:p-3 rounded-lg">
        <div className="flex">
          <div className="flex flex-col gap-y-2">
            <p className="md:text-xl text-lg font-semibold text-neutral-700 max-sm:text-sm">
              Private Transportation - Booking Form
            </p>
            <div className="h-[3px] max-sm:h-[2px] w-[50%] bg-primary" />
          </div>
        </div>
        {transportation === undefined ? (
          <div className="mt-6">
            <Skeleton className="w-full h-[150px] rounded-lg" />
          </div>
        ) : (
          <div className="mt-6 items-center pb-6 border-b">
            <div className="flex max-[460px]:flex-col items-start gap-2.5">
              <div className="relative w-[160px] max-[460px]:w-full h-[140px] max-[460px]:h-[200px] overflow-hidden rounded-md">
                <Image
                  src={transportation.url}
                  alt={transportation.title}
                  className="w-full h-full object-cover"
                  width={512}
                  height={512}
                  objectFit="cover"
                />
              </div>
              <div className="p-4 max-[460px]:p-2 py-0">
                <p className="text-lg text-neutral-800 font-medium max-[460px]:text-sm">
                  {transportation.title}
                </p>
                <div className="flex items-center gap-x-5">
                  <div className="flex items-end gap-2">
                    <span className="text-sm text-neutral-500">Price: </span>
                    <span className="font-semibold text-sm text-primary">
                      {parseFloat(transportation.price).toFixed(2)} USD
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-neutral-400" />
                  <div className="text-sm text-neutral-500">
                    {transportation.capacity}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 max-[460px]:mt-4">
                  <div className="">
                    <p className="text-xs text-neutral-800 underline font-medium mb-1">
                      Include
                    </p>
                    {transportation.include?.length &&
                      transportation.include.map((item, i) => (
                        <div className="text-xs text-neutral-500" key={i}>
                          {item}
                        </div>
                      ))}
                  </div>
                  <div className="">
                    <p className="text-xs text-neutral-800 underline font-medium mb-1">
                      Exclude
                    </p>
                    {transportation.exclude?.length &&
                      transportation.exclude.map((item, i) => (
                        <div className="text-xs text-neutral-500" key={i}>
                          {item}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-2 gap-x-3 gap-y-8">
            <div className="col-span-2">
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="direction">From - To</InputLabel>
                <OutlinedInput
                  id="direction"
                  type="text"
                  label="From - To"
                  value={displayDirection}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="swap"
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

            <div className="relative lg:col-span-1 col-span-2">
              {/* <FormControl fullWidth>
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
                            </FormControl> */}

              <TextField
                required
                label="Departure time"
                className="w-full"
                id="departure-time-field"
                onFocus={handleTimeFocus}
                value={
                  selectedTime ? moment(selectedTime).format("hh:mm A") : ""
                }
                InputProps={{ readOnly: true }}
              />
              {isTimeOpen && (
                <div className="absolute left-1/2 top-8 z-50">
                  <DatePicker
                    selected={selectedTime}
                    className="hidden"
                    onChange={(date) => handleTimeChange(date)}
                    timeIntervals={15}
                    showTimeSelect
                    showTimeSelectOnly
                    open={true}
                    onClickOutside={() => setIsTimeOpen(false)}
                    timeFormat="HH:mm a"
                  />
                </div>
              )}
            </div>
            <div className="relative lg:col-span-1 col-span-2">
              <TextField
                required
                label="Departure Date"
                className="w-full"
                id="departure-date-field"
                onFocus={handleDateFocus}
                value={
                  selectedDate ? moment(selectedDate).format("DD MMM YYYY") : ""
                }
                InputProps={{ readOnly: true }}
              />
              {isDateOpen && (
                <div className="absolute left-1/2 top-8 z-10">
                  <DatePicker
                    selected={selectedDate}
                    className="hidden"
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

            <div className="grid grid-cols-2 col-span-2 gap-4">
              <div>
                <FormControl sx={{}} variant="outlined">
                  <InputLabel id="passenger-select-label">
                    No. Passager
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-passager"
                    label="No. Passager"
                    endAdornment={
                      parseInt(passager) > 0 && parseInt(passager) < 2 ? (
                        <InputAdornment position="end">passager</InputAdornment>
                      ) : parseInt(passager) > 1 ? (
                        <InputAdornment position="end">
                          passagers
                        </InputAdornment>
                      ) : (
                        <></>
                      )
                    }
                    aria-describedby="outlined-passager-helper-text"
                    inputProps={{
                      "aria-label": "passager",
                    }}
                    value={passager}
                    onChange={(e) => handlePassagerChange(e)}
                  />
                </FormControl>
              </div>
              {direction === "from" && (
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
                      <MenuItem value={"One Way"}>One Way</MenuItem>
                      <MenuItem value={"Round trip"}>Round trip</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}
            </div>
            {trip === "Round trip" && (
              <>
                <div className="relative col-span-2">
                  <TextField
                    required
                    label="Return Date"
                    className="w-full"
                    id="return-date-field"
                    onFocus={handleReturnDateFocus}
                    value={
                      returnDate && returnDate
                        ? moment(returnDate).format("DD MMM YYYY")
                        : ""
                    }
                    InputProps={{ readOnly: true }}
                  />
                  {isReturnDateOpen && (
                    <div className="absolute left-1/2 top-8 z-10">
                      <DatePicker
                        selected={returnDate}
                        className="hidden"
                        onChange={(date) => handleReturnDateChange(date)}
                        timeIntervals={15}
                        ref={returnDatePickerRef}
                        open={true}
                        onClickOutside={() => setIsReturnDateOpen(false)}
                        // minDate={selectedDate || today}
                      />
                    </div>
                  )}
                </div>

                <div className="relative lg:col-span-1 col-span-2">
                  {/* <FormControl fullWidth>
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
                                    </FormControl> */}
                  <TextField
                    required
                    label="Return time"
                    className="w-full"
                    id="return-time-field"
                    onFocus={handleReturnTimeFocus}
                    value={
                      returnTime ? moment(returnTime).format("hh:mm A") : ""
                    }
                    InputProps={{ readOnly: true }}
                  />
                  {isReturnTimeOpen && (
                    <div className="absolute left-1/2 top-8 z-50">
                      <DatePicker
                        selected={returnTime}
                        className="hidden"
                        onChange={(date) => handleChangeReturnTime(date)}
                        timeIntervals={15}
                        showTimeSelect
                        showTimeSelectOnly
                        open={true}
                        onClickOutside={() => setIsReturnTimeOpen(false)}
                        minDate={today}
                        timeFormat="HH:mm a"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-14">
          <div className="flex">
            <div className="flex flex-col gap-y-2">
              <p className="text-xl font-medium text-neutral-700">
                Personal Information
              </p>
              {/* <div className='h-[3px] bg-primary' /> */}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 mt-4">
            <TextField
              required
              label="First name"
              type="text"
              error={!customerInfo?.lastName}
              id="firstname"
              value={customerInfo?.firstName ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (customerInfo) {
                  setCustomerInfo({
                    ...customerInfo,
                    firstName: e.target.value,
                  });
                } else {
                  setCustomerInfo({
                    firstName: e.target.value,
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    paymentInfo: "",
                    specialRequest: "",
                  });
                }
              }}
            />
            <TextField
              required
              label="Last name"
              type="text"
              id="lastname"
              error={!customerInfo?.lastName}
              value={customerInfo?.lastName ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (customerInfo) {
                  setCustomerInfo({
                    ...customerInfo,
                    lastName: e.target.value,
                  });
                } else {
                  setCustomerInfo({
                    firstName: "",
                    lastName: e.target.value,
                    email: "",
                    phoneNumber: "",
                    paymentInfo: "",
                    specialRequest: "",
                  });
                }
              }}
            />

            <TextField
              required
              label="Email"
              type="email"
              error={!customerInfo?.email}
              className="md:col-span-1 col-span-2"
              value={customerInfo?.email ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (customerInfo) {
                  setCustomerInfo({ ...customerInfo, email: e.target.value });
                } else {
                  setCustomerInfo({
                    firstName: "",
                    lastName: "",
                    email: e.target.value,
                    phoneNumber: "",
                    paymentInfo: "",
                    specialRequest: "",
                  });
                }
              }}
            />
            <TextField
              required
              label="Phone Number"
              type="text"
              error={!customerInfo?.phoneNumber}
              className="md:col-span-1 col-span-2"
              value={customerInfo?.phoneNumber ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (customerInfo) {
                  setCustomerInfo({
                    ...customerInfo,
                    phoneNumber: e.target.value,
                  });
                } else {
                  setCustomerInfo({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: e.target.value,
                    paymentInfo: "",
                    specialRequest: "",
                  });
                }
              }}
            />
            <FormControl fullWidth className="md:col-span-1 col-span-2">
              <InputLabel id="payment-select-label">Payment Method</InputLabel>
              <Select
                labelId="payment-select-label"
                id="payment-select"
                value={payment}
                label="Payment Method"
                onChange={handleChangePayment}
              >
                {payments &&
                  payments.map((item) => (
                    <MenuItem key={item._id} value={item.value}>
                      {item.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <div className="col-span-2">
              <TextField
                type="text"
                label="Special Request (optional)"
                className="w-full"
                multiline
                id="special-request"
                placeholder="Ex: I need a bottle of water"
                maxRows={4}
                value={customerInfo?.specialRequest ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (customerInfo) {
                    setCustomerInfo({
                      ...customerInfo,
                      specialRequest: e.target.value,
                    });
                  } else {
                    setCustomerInfo({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phoneNumber: "",
                      paymentInfo: "",
                      specialRequest: e.target.value,
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 grid lg:grid-cols-6 grid-cols-1 gap-4">
          <div className="grid lg:grid-cols-3 grid-cols-1 items-center gap-3 lg:col-span-5">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              ref={recaptchaRef}
              onChange={onChange}
              onExpired={handleExpired}
            />
          </div>
          <div className="">
            <Button
              className="h-12 w-full rounded cursor-pointer"
              disabled={!isVerified}
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
      <Dialog modal open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/email-tick.svg"
              alt="Success Booking"
              width={50}
              height={50}
              loading="lazy"
            />
            <p className="md:text-xl text-center text-lg font-medium text-neutral-700 mt-4">
              Your booking has been confirmed!
            </p>
            <p className="text-sm text-neutral-500 mt-2 text-center">
              Check your email for detail and bring <br /> confirmation number
              upon arrival.
            </p>
            <div className="mt-6 flex items-center gap-x-4">
              <Link href={`/booking-detail/${tranId}`} passHref>
                <Button
                  className="h-10 px-5 rounded cursor-pointer bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                  onClick={() => setCustomerInfo(null)}
                >
                  View Detail
                </Button>
              </Link>

              <Button
                className="h-10 px-8 rounded cursor-pointer"
                onClick={() => setIsSuccess(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={alert}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default BookTransportationMainPage;
