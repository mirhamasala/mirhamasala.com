import assert from "assert";

assert(process.env.NEXT_PUBLIC_API_PATH);

const config = { api_path: process.env.NEXT_PUBLIC_API_PATH };

export default config;
