import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './PagerStyles.css'

const MAX_COUNT = 2000

const propTypes = {
  currentPage: PropTypes.number
}

class Pager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: props.currentPage,
      pager: {}
    }
  }

  componentWillMount() {
    this.setPage(this.props.currentPage)
  }

  componentDidUpdate() {
    if (this.props.currentPage !== this.state.currentPage) {
      this.setState({
        currentPage: this.props.currentPage
      }, () => {this.setPage(this.state.currentPage)})
    }
  }

  setPage(page) {
    var pager = this.state.pager

    if (page < 1 || page > pager.totalPages) {
      return
    }

    pager = this.getPager(page)

    this.setState({pager: pager})
    this.props.onPageChange(pager.currentPage)
  }

  getPager(currentPage, pageSize) {
    currentPage = currentPage || 1
    pageSize = pageSize || 10

    var totalPages = Math.ceil(MAX_COUNT / pageSize)

    var startPage, endPage
    if (totalPages <= 10) {
      startPage = 1
      endPage = totalPages
    } else {
      if (currentPage <= 6) {
        startPage = 1
        endPage = 10
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9
        endPage = totalPages
      } else {
        startPage = currentPage - 5
        endPage = currentPage + 4
      }
    }

    var startIndex = (currentPage - 1) * pageSize
    var endIndex = Math.min(startIndex + pageSize - 1, MAX_COUNT - 1)

    function range(start, end) {
      var ans = []
      for (let i = start; i <= end; i++) {
        ans.push(i)
      }
      return ans
    }

    var pages = range(startPage, endPage + 1)

    return {
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    }
  }

  scrollTop(scrollDuration) {
    var scrollStep = -window.scrollY / (scrollDuration / 15),
      scrollInterval = setInterval(function () {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep)
        }
        else clearInterval(scrollInterval)
      }, 15)
  }

  render() {
    const {pager} = this.state

    return (
      <div className="pagination">
        <button
          className={[pager.currentPage === 1 ? 'disabled' : '', 'pagination-button'].filter(x => !!x).join(' ')}
          onClick={() => {
              this.setPage(pager.currentPage - 1)
              this.scrollTop(150)
            }
          }>
          Назад
        </button>
        {pager.pages.map((page, index) =>
          <button
            key={index}
            className={['pagination-button', pager.currentPage === page ? 'active' : ''].filter(x => !!x).join(' ')}
            onClick={() => {
                this.setPage(page)
                this.scrollTop(150)
              }
            }>
            {page}
          </button>
        )}
        <button
          className={[pager.currentPage === pager.totalPages ? 'disabled' : '', 'pagination-button'].filter(x => !!x).join(' ')}
          onClick={() => {
              this.setPage(pager.currentPage + 1)
              this.scrollTop(150)
            }
          }>
          Далее
        </button>
      </div>
    )
  }
}

Pager.propTypes = propTypes

export default Pager