import React, { useEffect, useState, useCallback } from "react";

interface UserCardProps {
  name: string;
  email: string;
  id: string;
  usingUser?: { id?: string } | null;
  age?: number;
}

const UserCard: React.FC<UserCardProps> = ({ name, email, id, usingUser }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [willLogin, setWillLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUseUser = useCallback(async () => {
    setLoading(true);
    try {
      console.log("starting feth user");
      const response = await fetch("https://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, id }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      await response.json();
      setWillLogin(true);
    } catch (error) {
      console.error("Error using user:", error);
    } finally {
      setLoading(false);
    }
  }, [name, email, id]);

  useEffect(() => {
    setIsLogin(Boolean(usingUser?.id === id));
  }, [usingUser, id]);
  return (
    <div className="flex flex-col gap-2 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-gray-800">{id}</p>
      <p className="text-gray-600">{email}</p>
      <button
        className={`rounded cursor-pointer transition font-bold font-sans text-xl ${
          isLogin || willLogin
            ? "bg-gray-400 text-white"
            : loading
            ? "bg-green-200 text-gray-700"
            : "bg-green-400 hover:bg-green-500 text-white"
        }`}
        onClick={handleUseUser}
        disabled={isLogin || loading}
        aria-busy={loading}>
        {willLogin
          ? "Will login(reload)"
          : isLogin
          ? "In use"
          : loading
          ? "Using..."
          : "Use"}
      </button>
    </div>
  );
};

export default UserCard;
