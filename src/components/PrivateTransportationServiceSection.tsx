"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@mui/material";

export interface TransportationType {
  _creationTime: number;
  _id: string;
  price: string;
  status: number;
  storageId: string;
  title: string;
  unit: string;
  url: string;
  include?: string[];
  exclude?: string[];
  capacity?: string;
}

const PrivateTransportationServiceSection = ({
  transportations,
}: {
  transportations: TransportationType[];
}) => {
  return (
    <section className="mt-[62px] container mx-auto mb-[100px]" id="#transport">
      <div>
        <h1 className="text-2xl font-medium text-neutral-800">
          Private Transportation Service
        </h1>
        <p className="text-sm text-neutral-500 max-w-[80%] mt-2">
          If you don&apos;t like the hassle of public transportation you can
          alternatively book a private transportation.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {transportations === undefined && (
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton
              animation={"pulse"}
              variant="rounded"
              height={80}
              className="flex-1"
            />
            <Skeleton
              animation={"pulse"}
              variant="rounded"
              height={80}
              className="flex-1"
            />
            <Skeleton
              animation={"pulse"}
              variant="rounded"
              height={80}
              className="flex-1"
            />
          </div>
        )}
        {transportations?.map(({ _id, title, url, price }) => (
          <Link
            key={_id}
            href={`/book-transportation/${_id}`}
            suppressHydrationWarning
          >
            <div className="flex items-center gap-x-3 bg-white p-3 rounded-lg transition-all duration-200 ease-in-out hover:shadow">
              <div className="w-[70px] h-[70px] relative overflow-hidden rounded-md">
                <Image
                  src={url}
                  alt={title}
                  fill
                  objectFit="cover"
                  loading="lazy"
                />
              </div>
              <div className="">
                <p className="text-sm font-medium text-neutral-800">{title}</p>
                <div className="flex items-center gap-x-2 mb-2">
                  <span className="text-xs text-neutral-500">Price:</span>
                  <span className="text-primary text-sm font-semibold">
                    {parseFloat(price).toFixed(2)} USD
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path fill="var(--primary)" d="m19 12l-7-6v5H6v2h6v5z" />
                  </svg>
                  <span className="text-xs text-primary font-semibold">
                    Book Now
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PrivateTransportationServiceSection;
