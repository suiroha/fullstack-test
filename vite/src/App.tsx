import { useEffect, useState } from "react";
import "./App.css";
import InputItemCard from "./components/InputItemCard";
import UserCard from "./components/UserCard";
import { useLoginStore } from "./context/store";
import ItemCard from "./components/ItemCard";

interface UserData {
  username: string;
  email: string;
  id: string;
  name?: string;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface dataItem {
  title: string;
  description: string;
  amount: number;
  user_id: string;
  id: string;
}

const Section = ({ title, children }: SectionProps) => (
  <section className="flex flex-col gap-6 items-center">
    <h2 className="text-2xl font-sans font-extrabold">{title}</h2>
    {children}
  </section>
);

const App = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [usingUser, setUsingUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState<dataItem[]>([]); // Adjust type as needed
  const setIsLogin = useLoginStore((state) => state.setIsLogin);
  console.log("App component rendered");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, verifyRes, getItemData] = await Promise.all([
          fetch("https://localhost:3000/"),
          fetch("https://localhost:3000/verify", {
            method: "GET",
            credentials: "include",
          }),
          fetch("https://localhost:3000/data", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        console.log("users: ", usersRes);
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const users: UserData[] = await usersRes.json();
        setUserData(users);

        if (!verifyRes.ok) throw new Error("Verification failed");
        if (!getItemData.ok) throw new Error("Failed to fetch item data");
        const itemData = await getItemData.json();
        setItemData(itemData);
        console.log("Item Data:", itemData);
        const verifyData = await verifyRes.json();
        setIsLogin(true);
        if (verifyData.payload) setUsingUser(verifyData.payload);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center gap-10">
      <Header usingUser={usingUser} />
      <div className="flex items-center justify-center">
        <InputItemCard />
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-screen p-4">
        <Section title="User List">
          <UserList
            loading={loading}
            userData={userData}
            usingUser={usingUser}
          />
        </Section>
        <Section title="Item List">
          {loading ? (
            <p className="text-gray-600">Loading item data...</p>
          ) : itemData.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {itemData.map((item) => (
                <ItemCard
                  key={item.id}
                  name={item.title}
                  description={item.description}
                  amount={item.amount}
                  userId={item.user_id}
                  id={item.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No items found.</p>
          )}
        </Section>
      </div>
    </div>
  );
};

const Header = ({ usingUser }: { usingUser: UserData | null }) => (
  <header>
    <h1 className="text-4xl font-extrabold text-center mb-6">
      User and Item Management
    </h1>
    <h2 className="text-2xl font-bold text-center">USING</h2>
    <p className="text-center text-gray-700">
      {usingUser ? usingUser.name : "No user logged in"}
    </p>
  </header>
);

interface UserListProps {
  loading: boolean;
  userData: UserData[];
  usingUser: UserData | null;
}

const UserList = ({ loading, userData, usingUser }: UserListProps) => (
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
);

export default App;
