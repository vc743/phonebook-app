
const Notification = ({ message, type }) => {
    if(message === null){
        return null
    }

  return (
    <div className={type === "error" ? type : "success"}>
        {message}
    </div>
  )
}

export default Notification