import { connect } from 'dva';
import { PureComponent } from 'react'
import { Table, Pagination, Popconfirm, Button } from 'antd';
import styles from './Users.css';
import { PAGE_SIZE } from '../constants';
import UserModal from './UserModal';

class Users extends PureComponent {

  constructor(props) {
    super(props)
  }

  deleteHandler = (id) => {
    const {dispatch} = this.props
    dispatch({
      type: 'users/remove',
      payload: id,
    });
  }

  pageChangeHandler = (page) => {
    const {dispatch} = this.props
    dispatch({
      type: 'users/fetch',
      payload: {page}
    })
  }

  editHandler = (id, values) => {
    const {dispatch} = this.props
    dispatch({
      type: 'users/patch',
      payload: { id, values },
    });
  }

  createHandler = (values) => {
    const {dispatch} = this.props
    dispatch({
      type: 'users/create',
      payload: values,
    });
  }

  componentDidMount() {
    this.pageChangeHandler(1)
  }

  render() {

    const {
      list:dataSource,
      total,
      page:current,
      loading} = this.props

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="">{text}</a>,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Website',
        dataIndex: 'website',
        key: 'website',
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
          <UserModal record={record} onOk={this.editHandler.bind(null,record.id)}>
            <a>Edit</a>
          </UserModal>
          <Popconfirm title="Confirm to delete?" onConfirm={this.deleteHandler.bind(null, record.id)}>
            <a href="">Delete</a>
          </Popconfirm>
        </span>
        ),
      },
    ];

    return (
      <div className={styles.normal}>
        <div>
          <div className={styles.create}>
            <UserModal record={{}} onOk={this.createHandler}>
              <Button type="primary">Create User</Button>
            </UserModal>
          </div>
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            rowKey={record => record.id}
            pagination={false}
          />
          <Pagination
            className="ant-table-pagination"
            total={total}
            current={current}
            pageSize={PAGE_SIZE}
            onChange={this.pageChangeHandler}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list, total, page } = state.users;
  return {
    list,
    total,
    page,
    loading: state.loading.models.users,
  };
}

export default connect(mapStateToProps)(Users);
