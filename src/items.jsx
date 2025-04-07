export default function Item ({ name, description, price, onDelete}) {
    return (
        <div className="foodItem">
            <div className="info">
                <strong>{name}</strong>
                <small className="description">{description}</small>
            </div>
            <div className="right">
                    --- {price.toLocaleString()}원 
                <button onClick={onDelete} className="deleteButton">X</button>
            </div>
        </div>

    );
}
// tolocalestring: 그 국가에 맞는 표현으로 format