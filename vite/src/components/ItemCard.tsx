interface ItemCardProps {
  name: string;
  description: string;
  amount: number;
  userId?: string;
  id?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
  name,
  description,
  amount,
  userId,
  id,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg justify-center">
      <h1 className="">UserId:{userId}</h1>
      <h1 className="">Id:{id}</h1>
      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-gray-600">{description}</p>
        <p className="text-gray-800 font-semibold">
          Amount: ${amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ItemCard;
