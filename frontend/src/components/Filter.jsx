const Filter = ({ term, handleFilterChange }) => {
    return (
        <div>
            filter shown with: <input value={term} onChange={handleFilterChange} />
        </div>
    )
}

export default Filter