import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {brand, title, imageUrl, rating, price} = details
  return (
    <li className="card">
      <img src={imageUrl} alt="similar product" className="similar-image" />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <div>
        <p>Rs {price} /-</p>
        <p>{rating}</p>
      </div>
    </li>
  )
}
export default SimilarProductItem
