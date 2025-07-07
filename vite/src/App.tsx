import { useEffect, useState } from "react";
import "./App.css";
import InputItemCard from "./components/InputItemCard";
import UserCard from "./components/UserCard";

interface UserData {
  username: string;
  email: string;
  id: string;
}

const App = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [usingUser, setUsingUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, verifyRes] = await Promise.all([
          fetch("https://localhost:3000/"),
          fetch("https://localhost:3000/verify", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!usersRes.ok) throw new Error("Failed to fetch users");
        
        const users: UserData[] = await usersRes.json();
        setUserData(users);
        
        if (!verifyRes.ok) throw new Error("Verification failed");
        const verifyData = await verifyRes.json();
        if (verifyData.payload) setUsingUser(verifyData.payload);
      } catch (err: any) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center gap-10">
      <header>
        <h1 className="text-4xl font-extrabold text-center mb-6">
          User and Item Management
        </h1>
        <h2 className="text-2xl font-bold text-center">USING</h2>
        <p className="text-center text-gray-700">
          {usingUser ? usingUser.username : "No user logged in"}
        </p>
      </header>
      <div className="flex items-center justify-center">
        <InputItemCard />
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-screen p-4">
        <Section title="User List">
          <div className="grid grid-cols-3 gap-3 items-center justify-evenly bg-gray-100">
            {loading ? (
              <p className="text-gray-600">Loading user data...</p>
            ) : userData.length > 0 ? (
              userData.map((user) => (
                <UserCard
                  key={user.id}
                  name={user.username}
                  email={user.email}
                  id={user.id}
                  usingUser={usingUser}
                />
              ))
            ) : (
              <p className="text-gray-600">No users found.</p>
            )}
          </div>
        </Section>
        <Section title="Item List">
          <div>{/* Item list content goes here */}</div>
        </Section>
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <section className="flex flex-col gap-6 items-center">
    <h2 className="text-2xl font-sans font-extrabold">{title}</h2>
    {children}
  </section>
);

export default App;
