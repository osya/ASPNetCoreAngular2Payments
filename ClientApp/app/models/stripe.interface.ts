export interface IStripeChargeModel {
    token: string;
    amount: number;
    currency: string;
    description: string;
    email: string;
}