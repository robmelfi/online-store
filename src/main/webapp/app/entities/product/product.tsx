import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, ButtonGroup, Col, Row, Table, ListGroup, ListGroupItem, Input } from 'reactstrap';
import Currency from 'react-currency-formatter';
// tslint:disable-next-line:no-unused-variable
import {
  openFile,
  byteSize,
  Translate,
  ICrudGetAllAction,
  getSortState,
  IPaginationBaseState,
  getPaginationItemsNumber,
  JhiPagination
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './product.reducer';
import { IProduct } from 'app/shared/model/product.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export interface IProductProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IProductState extends IPaginationBaseState {
  inputFilter: string;
}

export class Product extends React.Component<IProductProps, IProductState> {
  state: IProductState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE),
    inputFilter: ''
  };

  componentDidMount() {
    this.getEntities();
  }

  onChangeHandler = e => {
    this.setState({
      inputFilter: e.target.value
    });
  };

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.sortEntities()
    );
  };

  sortEntities() {
    this.getEntities();
    this.props.history.push(`${this.props.location.pathname}?page=${this.state.activePage}&sort=${this.state.sort},${this.state.order}`);
  }

  handlePagination = activePage => this.setState({ activePage }, () => this.sortEntities());

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  render() {
    const { productList, match, totalItems, isAuthenticated, isAdmin } = this.props;
    return (
      <div>
        <h2 id="product-heading">
          <Translate contentKey="storeApp.product.home.title">Products</Translate>
          { isAuthenticated && isAdmin &&
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp;
            <Translate contentKey="storeApp.product.home.createLabel">Create new Product</Translate>
          </Link> }
        </h2>
        <div className="mb-2 d-flex justify-content-end align-items-center">
          <span className="mr-2 col-2">Filter by name</span>
          <Input type="search" className="form-control" value={this.state.inputFilter} onChange={this.onChangeHandler}/>
          <span className="col-2 text-right"><Translate contentKey="storeApp.product.sort">Sort by</Translate></span>
          <ButtonGroup>
            <Button size="sm" className="btn-light" onClick={this.sort('name')}>
              <span><Translate contentKey="storeApp.product.name">Name</Translate> <FontAwesomeIcon icon="sort" /></span>
            </Button>
            <Button size="sm" className="btn-light" onClick={this.sort('price')}>
              <span><Translate contentKey="storeApp.product.price">Price</Translate> <FontAwesomeIcon icon="sort" /></span>
            </Button>
            <Button size="sm" className="btn-light" onClick={this.sort('size')}>
              <span><Translate contentKey="storeApp.product.size">Size</Translate> <FontAwesomeIcon icon="sort" /></span>
            </Button>
            <Button size="sm" className="btn-light">
              <span><Translate contentKey="storeApp.product.productCategory">Product Category</Translate> <FontAwesomeIcon icon="sort" /></span>
            </Button>
          </ButtonGroup>
        </div>
        <div className="mb-1">
          <ListGroup>
            {productList.filter(p => this.state.inputFilter === '' || p.name.toLowerCase().includes(this.state.inputFilter.toLowerCase()))
              .map((product, i) => (
              <ListGroupItem action tag="a" href={`#${match.url}/${product.id}`} className="flex-column align-items-start">
                <Row>
                  <Col sm="2" xs="12">
                    <div className="d-flex justify-content-center">
                      {product.image ? (
                        <a onClick={openFile(product.imageContentType, product.image)}>
                          <img src={`data:${product.imageContentType};base64,${product.image}`} style={{ maxHeight: '150px' }} />
                          &nbsp;
                        </a>
                      ) : null}
                    </div>
                  </Col>
                  <Col sm="10" xs="12">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{product.name}</h5>
                      <small>
                        {product.productCategory ? (
                          <Link to={`product-category/${product.productCategory.id}`}>{product.productCategory.name}</Link>
                        ) : (
                          ''
                        )}
                      </small>
                    </div>
                    <small className="mb-1">{product.description}</small>
                    <p className="mb-1"><Currency quantity={product.price} currency="USD"/></p>
                    <small>
                      <Translate contentKey="storeApp.product.size">Size</Translate>
                      <span>
                        :&nbsp;<Translate contentKey={`storeApp.Size.${product.size}`} />
                      </span>
                    </small>
                    { isAuthenticated && isAdmin && <div>
                      <Button tag={Link} to={`${match.url}/${product.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${product.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>}
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
        <Row className="justify-content-center">
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, this.state.itemsPerPage)}
            activePage={this.state.activePage}
            onSelect={this.handlePagination}
            maxButtons={5}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, product }: IRootState) => ({
  productList: product.entities,
  totalItems: product.totalItems,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  isAuthenticated: authentication.isAuthenticated
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Product);
