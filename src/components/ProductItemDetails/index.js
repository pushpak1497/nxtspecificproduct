import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {data: [], quantity: 1, similarData: []}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    const updatedData = {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      similarProducts: data.similar_products,
      title: data.title,
      totalReviews: data.total_reviews,
    }
    const {similarProducts} = updatedData
    const updatedSimilarData = similarProducts.map(each => ({
      brand: each.brand,

      imageUrl: each.image_url,
      price: each.price,
      rating: each.rating,

      title: each.title,
    }))

    this.setState({
      data: updatedData,
      similarData: updatedSimilarData,
    })
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  render() {
    const {data, quantity, similarData} = this.state
    const {
      title,
      imageUrl,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = data

    return (
      <>
        <Header />
        <div>
          <div className="products-detail-container">
            <img src={imageUrl} alt="image1" className="details-img" />
            <div className="details-text-container">
              <h1>{title}</h1>
              <h3>{price}</h3>
              <p>
                <span>{rating}</span>
                <span>{totalReviews} reviews</span>
              </p>
              <p>{description}</p>
              <p>Available: {availability}</p>
              <p>Brand: {brand}</p>
              <hr className="hr-line" />
              <div className="button-container">
                <button type="button" onClick={this.onDecrement}>
                  -
                </button>
                <p>{quantity}</p>
                <button type="button" onClick={this.onIncrement}>
                  +
                </button>
              </div>
              <button type="button">Add to Cart</button>
            </div>
          </div>
          <div className="similar-section">
            <h1 className="similar-heading">Similar Products</h1>
            <ul className="similar-list-container">
              {similarData.map(each => (
                <SimilarProductItem details={each} key={each.id} />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }
}
export default ProductItemDetails
