"use client";

import { FareDetail } from "@/lib/types/gds.type";

interface WPADisplayProps {
  data: {
    booking: any;
    fareDetail: FareDetail;
    passengerType: string;
    passengerCount: number;
  };
}

export function WPADisplay({ data }: WPADisplayProps) {
  const { booking, fareDetail, passengerType, passengerCount } = data;
  const { flight } = booking;
  const totalTaxBDT =
    (fareDetail.taxes.BD || 0) +
    (fareDetail.taxes.UT || 0) +
    (fareDetail.taxes.XT || 0);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg mb-4 font-mono text-sm">
      {/* Command Header */}
      <div className="bg-slate-900 p-2 border-b border-slate-700 text-green-400">
        WPA&lt;&lt;
      </div>

      {/* Passenger Type */}
      <div className="p-3 border-b border-slate-700">
        <div className="text-slate-300">
          PSGR TYPE {passengerType} - {String(passengerCount).padStart(2, "0")}
        </div>
      </div>

      {/* Fare Header */}
      <div className="p-3 border-b border-slate-700">
        <div className="text-xs text-slate-400 mb-2">
          CXR RES DATE FARE BASIS NVB NVA BG
        </div>
        <div className="text-slate-100 space-y-1 text-xs">
          <div>{flight.origin}</div>
          <div>
            {flight.destination} {flight.airline} {fareDetail.class}{" "}
            {flight.date} {fareDetail.fareBasis} {fareDetail.nvb}{" "}
            {fareDetail.nva} {fareDetail.baggage}
          </div>
        </div>
      </div>

      {/* Fare Amount */}
      <div className="p-3 border-b border-slate-700 space-y-1">
        <div className="text-slate-300">
          FARE USD {fareDetail.baseFareUSD.toFixed(2)} EQUIV BDT{" "}
          {fareDetail.baseFareBDT.toLocaleString()}
        </div>
      </div>

      {/* Taxes */}
      <div className="p-3 border-b border-slate-700 space-y-1">
        <div className="text-slate-300">
          TAX BDT {fareDetail.taxes.BD ? `${fareDetail.taxes.BD}BD` : ""} BDT{" "}
          {fareDetail.taxes.UT ? `${fareDetail.taxes.UT}UT` : ""} BDT{" "}
          {fareDetail.taxes.XT ? `${fareDetail.taxes.XT}XT` : ""}
        </div>
      </div>

      {/* Total */}
      <div className="p-3 border-b border-slate-700">
        <div className="text-slate-100 font-bold text-lg">
          TOTAL BDT {fareDetail.totalBDT.toLocaleString()}
        </div>
      </div>

      {/* Additional Details */}
      <div className="p-3 border-b border-slate-700 space-y-2 text-xs">
        <div className="text-slate-300">
          {passengerType}-{String(passengerCount).padStart(2, "0")}{" "}
          {fareDetail.fareBasis}
        </div>
        <div className="text-slate-300">
          {flight.origin} {flight.airline} {flight.destination}
          {fareDetail.baseFareUSD.toFixed(2)}NUC{fareDetail.nuc.toFixed(2)}END
          ROE{fareDetail.roe.toFixed(2)}
        </div>
        <div className="text-slate-300">
          XT BDT{fareDetail.taxes.W ? `${fareDetail.taxes.W}W` : ""}{" "}
          {fareDetail.taxes.E5 ? `BDT${fareDetail.taxes.E5}E5` : ""}{" "}
          {fareDetail.taxes.YR ? `BDT${fareDetail.taxes.YR}YR` : ""}{" "}
          {fareDetail.taxes.P8 ? `BDT${fareDetail.taxes.P8}P8` : ""}{" "}
          {fareDetail.taxes.P7 ? `BDT${fareDetail.taxes.P7}P7` : ""}
        </div>
        <div className="text-slate-300">
          ENDOS*SEG1*CHNG FEE {fareDetail.changeFee ? "APPLY" : "NO"}/REFUND FEE{" "}
          {fareDetail.refundFee ? "APPLY" : "NO"}/NO SHOW FEE{" "}
          {fareDetail.noShowFee ? "APPLY" : "NO"}
        </div>
        <div className="text-slate-300">RATE USED {fareDetail.rateUsed}</div>
        <div className="text-slate-300">
          ATTN*VALIDATING CARRIER - {fareDetail.validatingCarrier}
        </div>
      </div>

      {/* Payment Fees */}
      {fareDetail.paymentFees && fareDetail.paymentFees.length > 0 && (
        <div className="p-3 space-y-2">
          <div className="text-slate-400 text-xs">
            FORM OF PAYMENT FEES PER TICKET MAY APPLY
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <span className="text-slate-400">ADT</span>
            <span className="text-slate-400">DESCRIPTION</span>
            <span className="text-slate-400">FEE</span>
            <span className="text-slate-400">TKT TOTAL</span>
          </div>
          {fareDetail.paymentFees.map((fee, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 gap-2 text-xs text-slate-300"
            >
              <span>{passengerType}</span>
              <span>{fee.description}</span>
              <span>{fee.fee}</span>
              <span>{fee.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
