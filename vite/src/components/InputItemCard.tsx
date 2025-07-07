const InputItemCard = () => {
    return (
        <form className="flex flex-col gap-2 p-4 bg-white shadow-md rounded-lg">
            <label htmlFor="name">Input Card</label>
            <input type="text" name="name" id="name" className="border p-2 rounded" />
            <label htmlFor="description">Description</label>
            <input type="text" name="description" id="description" className="border p-2 rounded" />
            <label htmlFor="amount">Amount</label>
            <input type="number" name="amount" id="amount" className="border p-2 rounded" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add</button>
        </form>
    );
}

export default InputItemCard;