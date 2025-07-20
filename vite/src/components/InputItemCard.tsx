import { useEffect, useCallback } from "react";
import { useLoginStore, useItemsStore } from "../context/store";

interface DataType {
  name: string;
  description: string;
  amount: number;
}

const InputItemCard = () => {
  const isLogin = useLoginStore((state) => state.isLogin);
  const setItems = useItemsStore((state) => state.setItems);
  const items = useItemsStore((state) => state.items);

  const postData = useCallback(async () => {
    console.log("Posting data:", items, isLogin);
    console.log("isLogin:", items === null ? "null" : isLogin);
    if (!items || !isLogin) return;
    try {
      const response = await fetch("https://localhost:3000/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to post data");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }, [items, isLogin]);

  useEffect(() => {
    postData();
  }, [postData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newData: DataType = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      amount: Number(formData.get("amount")),
    };
    setItems(newData);
    e.currentTarget.reset();
  };

  return (
    <form
      className="flex flex-col gap-2 p-4 bg-white shadow-md rounded-lg"
      onSubmit={handleSubmit}
    >
      <label htmlFor="name">Input Card</label>
      <input
        type="text"
        name="name"
        id="name"
        className="border p-2 rounded"
        required
      />
      <label htmlFor="description">Description</label>
      <input
        type="text"
        name="description"
        id="description"
        className="border p-2 rounded"
        required
      />
      <label htmlFor="amount">Amount</label>
      <input
        type="number"
        name="amount"
        id="amount"
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className={`bg-blue-500 text-white p-2 rounded ${
          isLogin
            ? "hover:bg-blue-600 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!isLogin}
      >
        Add
      </button>
    </form>
  );
};

export default InputItemCard;
