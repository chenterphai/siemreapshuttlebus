import FooterComponent from "@/components/FooterComponent";
import HeaderComponent from "@/components/HeaderComponent";
// import { MapProvider } from "@/contexts/MapProvider";
import React, { Fragment } from "react";

export default function FrontEndLayout({
    children,
    modal
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        // <MapProvider>
        //     <HeaderComponent />
        //     {children}
        //     <FooterComponent />
        // </MapProvider>
        <Fragment>
            <HeaderComponent />
            <main className="px-4 md:px-0">
                {children}
            </main>
            {modal}
            <FooterComponent />
        </Fragment>
    )
}