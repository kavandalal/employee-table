import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import axios from 'axios';

function MainTable() {
	// setup pagination start
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [totalPagination, setTotalPagination] = useState(3);
	const [totalPage, setTotalPage] = useState();
	const [minPage, setMinPage] = useState(1);
	const [maxPage, setMaxPage] = useState(3);
	const [pagesArr, setPagesArr] = useState([]);
	// setup pagination end

	const [totalData, setTotalData] = useState(0);
	const [allDataArr, setAllDataArr] = useState([]);
	const [hitApi, setHitApi] = useState(false);

	const navigate = useNavigate();

	const [param, setParam] = useState({
		status: false,
		username: '',
	});

	useEffect(() => {
		const numPage = Math.ceil(totalData / perPage);
		setTotalPage(numPage);
		const arr = [];
		for (let i = 1; i <= numPage; i++) {
			arr.push(i);
		}
		setPagesArr(arr);
	}, [totalData]);

	useEffect(() => {
		setParam({
			status: false,
			username: '',
		});
	}, []);

	useEffect(() => {
		getAllUser();
	}, [perPage, hitApi, currentPage]);

	const getAllUser = async () => {
		const payload = {
			pageNo: currentPage,
			sortBy: [],
			perPage: perPage,
		};
		await axios
			.post('/api/getAll', payload)
			.then((res) => {
				if (res?.data?.success) {
					console.log(res?.data?.data);
					setAllDataArr(res?.data?.data);
					setTotalData(res?.data?.totalUser);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const handlePageBack = () => {
		if (currentPage > 1) {
			const current = currentPage;
			if ((current - 1) % totalPagination === 0) {
				setMinPage((prev) => Math.abs(prev - totalPagination));
				setMaxPage((prev) => Math.abs(prev - totalPagination));
			}
			setCurrentPage((prev) => prev - 1);
		}
	};
	const handlePageNext = () => {
		if (currentPage < totalPage) {
			const current = currentPage;
			if ((current + 1) % totalPagination === 1) {
				setMinPage((prev) => prev + totalPagination);
				setMaxPage((prev) => prev + totalPagination);
			}
			setCurrentPage(currentPage + 1);
		}
	};
	const pageClick = (num) => {
		setCurrentPage(num);
	};
	const handlePerPageChange = (e) => {
		const { value } = e.target;
		setPerPage(value);
	};

	const callAction = async (action = 'edit', username = 'kavan1') => {
		if (action === 'edit') {
			if (username) {
				navigate(`/${username}`, { state: { data: 'edit' } });
			}
		} else if (action === 'add') {
			if (username) {
				navigate(`/${username}`, { state: { data: 'add' } });
			}
		} else if (action === 'delete') {
			await axios
				.get(`/api/delete/${username}`)
				.then((res) => {
					if (res?.data?.success) {
						console.log(res?.data);
						setHitApi(!hitApi);
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};

	console.log(1, allDataArr);
	return (
		<div>
			<section className='main__header'>
				<div className='d-flex justify-content-end align-items-center mb-2'>
					<div className='cursor-pointer me-2 plus__icon'>
						<select name='' value={perPage} onChange={handlePerPageChange} id=''>
							<option value='10'>10</option>
							<option value='25'>25</option>
							<option value='50'>50</option>
						</select>
					</div>
					<div className='cursor-pointer me-2'>
						<i class='fa fa-filter plus__icon' aria-hidden='true'></i>
					</div>
					<div className='cursor-pointer' onClick={() => callAction('add')}>
						<i class='fa fa-plus plus__icon ' aria-hidden='true'></i>
					</div>
				</div>
			</section>
			<section className='main__div scrollWidth'>
				{/* Main */}
				<div className=''>
					<Table className='main__table'>
						<thead className='table__header'>
							<tr>
								<th></th>
								<th>User Name</th>
								<th>Email ID</th>
								<th>Phone</th>
								<th>Gender</th>
								<th>Status</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{allDataArr.map((i) => (
								<tr className=''>
									<td>
										<img src={i?.avatar?.url} height={40} />
									</td>
									<td>{i?.username}</td>
									<td>{i?.email}</td>
									<td>{i?.phone}</td>
									<td>{i?.gender === 'M' ? 'Male' : i?.gender === 'F' ? 'Female' : 'Other'}</td>
									<td>
										{i?.status === false ? (
											<i class='fa fa-solid fa-circle red '></i>
										) : (
											<i class='fa fa-solid fa-circle green'></i>
										)}
									</td>
									<td>
										{/* <i class='fa fa-ellipsis-v' aria-hidden='true'></i> */}
										<div className='d-flex align-items-center justify-content-center '>
											<div className='cursor-pointer' onClick={() => callAction('edit', i?.username)}>
												<i class='fa fa-pencil-square-o me-1' aria-hidden='true'></i>
											</div>
											<div className='cursor-pointer' onClick={() => callAction('delete', i?._id)}>
												<i class='fa fa-trash' aria-hidden='true'></i>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			</section>
			<section>
				<div className='d-flex justify-content-end mt-2'>
					<div className='me-2 cursor-pointer' onClick={handlePageBack} disable={currentPage == 1 ? true : false}>
						<i class='fa fa-chevron-left plus__icon' aria-hidden='true'></i>
					</div>
					{pagesArr.length > 0 &&
						pagesArr.map((i) => {
							if (minPage <= i && maxPage >= i) {
								return (
									<div
										className={` cursor-pointer me-2 ${currentPage === i ? 'active__page' : ''}`}
										onClick={() => pageClick(i)}>
										<i class='fa plus__icon' aria-hidden='true'>
											<b>{i}</b>
										</i>
									</div>
								);
							}
						})}
					<div className=' cursor-pointer' onClick={handlePageNext}>
						<i class='fa fa-chevron-right plus__icon' aria-hidden='true'></i>
					</div>
				</div>
			</section>
		</div>
	);
}

export default MainTable;
