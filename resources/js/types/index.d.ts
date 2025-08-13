export interface Role {
    id: number;
    name: string;
    guard_name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles?: Role[];
    permissions?: string[];
    has_active_subscription?: boolean;
}

export interface PricingPrice {
    id: string;
    amount: number;
    currency: string;
    interval?: string;
    interval_count?: number;
    type: string;
    formatted_amount: string;
}

export interface PricingPlan {
    id: string;
    name: string;
    description?: string;
    images: string[];
    metadata: Record<string, string>;
    prices: PricingPrice[];
    default_price?: PricingPrice;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    pricingPlans?: PricingPlan[];
};
