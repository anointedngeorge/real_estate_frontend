import { ResponseInterface, SalesOutInterface } from "@/interfaces/general";
import { create_object, update_object_info } from "@/lib/axios_functions";
import { useForm } from "react-hook-form";

interface Props {
  billing_name?: "week" | "month" | string;
  billing_date_number: number;
  sales_date: Date;
}

interface SaveProps {
  billing_name: string;
  billing_dates: string[];
  sales_id: string;
  billing_period_number: number;
}

export interface ResultProps {
  dates?: string[];
  date_to_string?: string[];
  billing_name?: string;
  billing_date_number?: number;
}

export interface InitiatePaymentInterface {
  sales_id: string;
  id: string;
  billing_amount_to_pay: number;
  billing_date: string;
}

function dateFormatter(date: Date) {
  return new Intl.DateTimeFormat("en-CA").format(date);
}

export class SalesServices {
  //
  paymentPlanSpread({
    billing_name,
    billing_date_number,
    sales_date,
  }: Props): ResultProps {
    const dates: string[] = [];
    const date_to_string: string[] = [];
    const currentSalesDate = new Date(sales_date);

    dates.length = 0;
    date_to_string.length = 0;
    switch (billing_name) {
      case "week":
        for (let i = 1; i <= billing_date_number; i++) {
          const nextDate = new Date(currentSalesDate);
          nextDate.setDate(nextDate.getDate() + i * 7);
          const fmt = dateFormatter(nextDate);
          date_to_string.push(nextDate.toDateString());
          dates.push(fmt);
        }
        break;

      case "month":
        for (let i = 1; i <= billing_date_number; i++) {
          const nextDate = new Date(currentSalesDate);
          nextDate.setMonth(nextDate.getMonth() + i);
          const fmt = dateFormatter(nextDate);
          date_to_string.push(nextDate.toDateString());
          dates.push(fmt);
        }
        break;

      default:
        const result: ResultProps = {
          dates: [],
          date_to_string: [],
        };
        return result;
    }

    const result: ResultProps = {
      dates: dates,
      date_to_string: date_to_string,
      billing_date_number: billing_date_number,
      billing_name: billing_name,
    };
    return result;
  }

  async savePaymentPlan(data: SaveProps) {
    if (
      !confirm(
        "You're about to create a new record, this will erase the original information. If not sure, use add more button.",
      )
    ) {
      return;
    }

    const dt: ResponseInterface = await create_object<SaveProps>(
      data,
      "sales/create_sales_payment_plan",
    );

    if (dt.status == true) {
      // globalThis.location.reload();
      console.log(dt);
    }
  }

  async initiatePayment(data: InitiatePaymentInterface) {
    //
    const dt: ResponseInterface =
      await update_object_info<InitiatePaymentInterface>(
        data,
        "sales/update_sales_payment_plan",
      );

    if (dt.status == true) {
      globalThis.location.reload();
    }
  }

  // referralList(objectData : SalesOutInterface, selector:string, name:string) {
  //     const data =  objectData?.realtor?.referralList
  //     return data[selector][name]
  // }

}
