"use client";
 
import { useState } from "react";
import { getWeatherInfo } from "./action";
 
export function Form() {
  const [result, setResult] = useState<string | null>(null);
 
  async function handleSubmit(formData: FormData) {
    const res = await getWeatherInfo(formData);
    setResult(res);
  }
 
  return (
    <>
      <form action={handleSubmit}>
        <input name="city" placeholder="Enter city" required />
        <button type="submit">Get Weather</button>
      </form>
      {result && <pre>{result}</pre>}
    </>
  );
}