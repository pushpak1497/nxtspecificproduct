import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    data: [],
    quantity: 1,
    similarData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inprogress,
    })
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
    if (response.ok) {
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
      console.log(similarProducts)
      const updatedSimilarData = similarProducts.map(each => ({
        brand: each.brand,
        id: each.id,
        imageUrl: each.image_url,
        price: each.price,
        rating: each.rating,

        title: each.title,
      }))

      this.setState({
        data: updatedData,
        similarData: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
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

  onClickContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderDetailView = () => {
    const {data, quantity, similarData} = this.state
    console.log(similarData)
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
            <img src={imageUrl} alt="product" className="details-img" />
            <div className="details-text-container">
              <h1>{title}</h1>
              <p>{price}</p>
              <p>{rating}</p>
              <p>{totalReviews} reviews</p>

              <p>{description}</p>
              <p>Available: {availability}</p>
              <p>Brand: {brand}</p>
              <hr className="hr-line" />
              <div className="button-container">
                <button
                  type="button"
                  data-testid="minus"
                  aria-label="save"
                  onClick={this.onDecrement}
                >
                  <BsDashSquare />
                </button>
                <p>{quantity}</p>
                <button
                  type="button"
                  data-testid="plus"
                  aria-label="save"
                  onClick={this.onIncrement}
                >
                  <BsPlusSquare />
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

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.onClickContinue}>
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderDetailView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default ProductItemDetails
