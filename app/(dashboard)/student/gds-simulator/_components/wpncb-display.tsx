"use client";

import { FareDetail, Flight } from "@/lib/types/gds.type";

interface WPNCBDisplayProps {
  data: {
    lowestFare: {
      flight: Flight;
      fareDetail: FareDetail;
    };
    allFares: Array<{
      flight: Flight;
      fareDetail: FareDetail;
    }>;
  };
}

export function WPNCBDisplay({ data }: WPNCBDisplayProps) {
  const { lowestFare, allFares } = data;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg mb-4 font-mono text-sm">
      {/* Command Header */}
      <div className="bg-slate-900 p-2 border-b border-slate-700 text-green-400">
        WPNCB&lt;&lt;
      </div>

      {/* Fare Columns */}
      <div className="p-3 border-b border-slate-700">
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-slate-400 text-xs">BASE FARE</div>
          <div className="text-slate-400 text-xs">EQUIV AMOUNT</div>
          <div className="text-slate-400 text-xs">TAXES/FEES/CHARGES</div>
        </div>

        {/* Lowest Fare Row */}
        <div className="grid grid-cols-3 gap-4 space-y-2">
          <div className="space-y-1">
            <div className="text-slate-100">
              USD{lowestFare.fareDetail.baseFareUSD.toFixed(2)}
            </div>
            {lowestFare.fareDetail.taxes.BD && (
              <div className="text-slate-300 text-xs">
                {lowestFare.fareDetail.taxes.BD}BD
              </div>
            )}
            {lowestFare.fareDetail.taxes.YR && (
              <div className="text-slate-300 text-xs">
                {lowestFare.fareDetail.taxes.YR}YR
              </div>
            )}
            <div className="text-slate-100">
              {lowestFare.fareDetail.baseFareUSD.toFixed(2)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-slate-100">
              BDT{lowestFare.fareDetail.baseFareBDT.toLocaleString()}
            </div>
            {lowestFare.fareDetail.taxes.UT && (
              <div className="text-slate-300 text-xs">
                {lowestFare.fareDetail.taxes.UT}UT
              </div>
            )}
            {lowestFare.fareDetail.taxes.P8 && (
              <div className="text-slate-300 text-xs">
                {lowestFare.fareDetail.taxes.P8}P8
              </div>
            )}
            <div className="text-slate-100">
              {lowestFare.fareDetail.baseFareBDT.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            {lowestFare.fareDetail.taxes.XT && (
              <div className="text-slate-100">
                BDT{lowestFare.fareDetail.taxes.XT}XT
              </div>
            )}
            {lowestFare.fareDetail.taxes.W && (
              <div className="text-slate-300 text-xs">
                {lowestFare.fareDetail.taxes.W}W
              </div>
            )}
            {lowestFare.fareDetail.taxes.P7 && (
              <div className="text-slate-300 text-xs">
                {lowestFare.fareDetail.taxes.P7}P7
              </div>
            )}
            <div className="text-slate-100">
              {(
                (lowestFare.fareDetail.taxes.XT || 0) +
                (lowestFare.fareDetail.taxes.W || 0) +
                (lowestFare.fareDetail.taxes.E5 || 0) +
                (lowestFare.fareDetail.taxes.YR || 0) +
                (lowestFare.fareDetail.taxes.P8 || 0) +
                (lowestFare.fareDetail.taxes.P7 || 0)
              ).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <div className="text-slate-100 font-bold text-lg">
          TOTAL: BDT {lowestFare.fareDetail.totalBDT.toLocaleString()}
        </div>
        <div className="text-slate-300 text-xs">
          BDT {lowestFare.fareDetail.totalBDT.toLocaleString()} ADT
        </div>
      </div>

      {/* Additional Details */}
      <div className="p-3 border-b border-slate-700 space-y-2 text-xs">
        <div className="text-slate-300">
          ADT-1 {lowestFare.fareDetail.fareBasis}
        </div>
        <div className="text-slate-300">
          {lowestFare.flight.origin} {lowestFare.flight.airline}{" "}
          {lowestFare.flight.destination}
          {lowestFare.fareDetail.baseFareUSD.toFixed(2)}NUC
          {lowestFare.fareDetail.nuc.toFixed(2)}END ROE
          {lowestFare.fareDetail.roe.toFixed(2)}
        </div>
        <div className="text-slate-300">
          XT BDT
          {lowestFare.fareDetail.taxes.W
            ? `${lowestFare.fareDetail.taxes.W}W`
            : ""}{" "}
          {lowestFare.fareDetail.taxes.E5
            ? `BDT${lowestFare.fareDetail.taxes.E5}E5`
            : ""}{" "}
          {lowestFare.fareDetail.taxes.YR
            ? `BDT${lowestFare.fareDetail.taxes.YR}YR`
            : ""}{" "}
          {lowestFare.fareDetail.taxes.P8
            ? `BDT${lowestFare.fareDetail.taxes.P8}P8`
            : ""}{" "}
          {lowestFare.fareDetail.taxes.P7
            ? `BDT${lowestFare.fareDetail.taxes.P7}P7`
            : ""}
        </div>
        <div className="text-slate-300">
          CHNG FEE {lowestFare.fareDetail.changeFee ? "APPLY" : "NO"}/REFUND FEE{" "}
          {lowestFare.fareDetail.refundFee ? "APPLY" : "NO"}/NO SHOW FEE{" "}
          {lowestFare.fareDetail.noShowFee ? "APPLY" : "NO"}
        </div>
        <div className="text-slate-300">
          RATE USED {lowestFare.fareDetail.rateUsed}
        </div>
        <div className="text-slate-300">
          VALIDATING CARRIER - {lowestFare.fareDetail.validatingCarrier}
        </div>
        {lowestFare.fareDetail.brandedFare && (
          <div className="text-slate-300">
            BRANDED FARE /{lowestFare.fareDetail.brandedFare}
          </div>
        )}
      </div>

      {/* Payment Fees */}
      {lowestFare.fareDetail.paymentFees &&
        lowestFare.fareDetail.paymentFees.length > 0 && (
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
            {lowestFare.fareDetail.paymentFees.map((fee, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-2 text-xs text-slate-300"
              >
                <span>ADT</span>
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
