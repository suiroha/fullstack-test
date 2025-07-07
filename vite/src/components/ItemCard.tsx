interface ItemCardProps {
    name: string;
    description: string;
    amount: number;
}

const ItemCard: React.FC<ItemCardProps> = ({ name, description, amount }) => {
    return (
        <div className="flex flex-col gap-2 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="text-gray-600">{description}</p>
            <p className="text-gray-800 font-semibold">Amount: ${amount.toFixed(2)}</p>
        </div>
    );
}

export default ItemCard;
