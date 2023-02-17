import assert from "assert";

assert(process.env.NEXT_PUBLIC_API_URL);

const config = {api_path: process.env.NEXT_PUBLIC_API_URL};

export default config;
