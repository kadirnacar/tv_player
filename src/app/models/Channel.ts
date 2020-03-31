export interface IChannel {
    type: any;
    category: string;
    name: string;
    url: string;
    eval?: boolean;
    evalurl?: string;
    pageUrl: string;
    iframe?: boolean;
    urlRegex: string;
}