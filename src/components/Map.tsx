/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

//Map component Component from library
// import { GoogleMap } from "@react-google-maps/api";

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '384px',
};

// const defaultMapCenter = {
//     lat: 103.8471064,
//     lng: 13.35787230
// }

// const defaultMapZoom = 14

// const defaultMapOptions = {
//     zoomControl: true,
//     tilt: 0,
//     gestureHandling: 'auto',
//     mapTypeId: 'terrain',
// };

const Maps = () => {
    return (
        <div className="w-full rounded-2xl overflow-hidden border-2 md:mt-0 mt-6">
            {/* <GoogleMap
                mapContainerStyle={defaultMapContainerStyle}
                center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions}
            >
            </GoogleMap> */}
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3881.8217374276755!2d103.862009!3d13.361358!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3110175639232897%3A0x84833ca8eea2ff00!2sAirport%20Bus%20Stop%20(CDF)!5e0!3m2!1sen!2skh!4v1748618060639!5m2!1sen!2skh"
                width="100%"
                className="lg:h-[380px] xl:h-[360px] md:h-[418px] h-[400px]"
                loading="lazy">
            </iframe>
        </div>
    )
};

export { Maps };