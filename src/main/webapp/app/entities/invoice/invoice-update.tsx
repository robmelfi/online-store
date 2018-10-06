import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProductOrder } from 'app/shared/model/product-order.model';
import { getEntities as getProductOrders } from 'app/entities/product-order/product-order.reducer';
import { getEntity, updateEntity, createEntity, reset } from './invoice.reducer';
import { IInvoice } from 'app/shared/model/invoice.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IInvoiceUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IInvoiceUpdateState {
  isNew: boolean;
  orderId: string;
}

export class InvoiceUpdate extends React.Component<IInvoiceUpdateProps, IInvoiceUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getProductOrders();
  }

  saveEntity = (event, errors, values) => {
    values.date = new Date(values.date);
    values.paymentDate = new Date(values.paymentDate);

    if (errors.length === 0) {
      const { invoiceEntity } = this.props;
      const entity = {
        ...invoiceEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
      this.handleClose();
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/invoice');
  };

  render() {
    const { invoiceEntity, productOrders, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="storeApp.invoice.home.createOrEditLabel">
              <Translate contentKey="storeApp.invoice.home.createOrEditLabel">Create or edit a Invoice</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : invoiceEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="invoice-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="dateLabel" for="date">
                    <Translate contentKey="storeApp.invoice.date">Date</Translate>
                  </Label>
                  <AvInput
                    id="invoice-date"
                    type="datetime-local"
                    className="form-control"
                    name="date"
                    value={isNew ? null : convertDateTimeFromServer(this.props.invoiceEntity.date)}
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="detailsLabel" for="details">
                    <Translate contentKey="storeApp.invoice.details">Details</Translate>
                  </Label>
                  <AvField id="invoice-details" type="text" name="details" />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel">
                    <Translate contentKey="storeApp.invoice.status">Status</Translate>
                  </Label>
                  <AvInput
                    id="invoice-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && invoiceEntity.status) || 'PAID'}
                  >
                    <option value="PAID">
                      <Translate contentKey="storeApp.InvoiceStatus.PAID" />
                    </option>
                    <option value="ISSUED">
                      <Translate contentKey="storeApp.InvoiceStatus.ISSUED" />
                    </option>
                    <option value="CANCELLED">
                      <Translate contentKey="storeApp.InvoiceStatus.CANCELLED" />
                    </option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="paymentMethodLabel">
                    <Translate contentKey="storeApp.invoice.paymentMethod">Payment Method</Translate>
                  </Label>
                  <AvInput
                    id="invoice-paymentMethod"
                    type="select"
                    className="form-control"
                    name="paymentMethod"
                    value={(!isNew && invoiceEntity.paymentMethod) || 'CREDIT_CARD'}
                  >
                    <option value="CREDIT_CARD">
                      <Translate contentKey="storeApp.PaymentMethod.CREDIT_CARD" />
                    </option>
                    <option value="CASH_ON_DELIVERY">
                      <Translate contentKey="storeApp.PaymentMethod.CASH_ON_DELIVERY" />
                    </option>
                    <option value="PAYPAL">
                      <Translate contentKey="storeApp.PaymentMethod.PAYPAL" />
                    </option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="paymentDateLabel" for="paymentDate">
                    <Translate contentKey="storeApp.invoice.paymentDate">Payment Date</Translate>
                  </Label>
                  <AvInput
                    id="invoice-paymentDate"
                    type="datetime-local"
                    className="form-control"
                    name="paymentDate"
                    value={isNew ? null : convertDateTimeFromServer(this.props.invoiceEntity.paymentDate)}
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="paymentAmountLabel" for="paymentAmount">
                    <Translate contentKey="storeApp.invoice.paymentAmount">Payment Amount</Translate>
                  </Label>
                  <AvField
                    id="invoice-paymentAmount"
                    type="text"
                    name="paymentAmount"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      number: { value: true, errorMessage: translate('entity.validation.number') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="order.id">
                    <Translate contentKey="storeApp.invoice.order">Order</Translate>
                  </Label>
                  <AvInput id="invoice-order" type="select" className="form-control" name="order.id">
                    <option value="" key="0" />
                    {productOrders
                      ? productOrders.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/invoice" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  productOrders: storeState.productOrder.entities,
  invoiceEntity: storeState.invoice.entity,
  loading: storeState.invoice.loading,
  updating: storeState.invoice.updating
});

const mapDispatchToProps = {
  getProductOrders,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceUpdate);
