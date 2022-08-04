import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';

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
	const navigate = useNavigate();

	const [param, setParam] = useState({
		status: false,
		username: '',
	});

	useEffect(() => {
		const totalData = 453;
		const numPage = Math.ceil(totalData / perPage);
		setTotalPage(numPage);
		const arr = [];
		for (let i = 1; i <= numPage; i++) {
			arr.push(i);
		}
		setPagesArr(arr);
	}, []);

	useEffect(() => {
		setParam({
			status: false,
			username: '',
		});
	}, []);

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

	const callAction = (action = 'edit', username = 'kavan1') => {
		if (action === 'edit') {
			if (username) {
				navigate(`/${username}`);
			}
		} else if (action === 'delete') {
		}
	};

	console.log(1, minPage, maxPage, pagesArr);
	return (
		<div>
			<section className='main__header'>
				<div className='d-flex justify-content-end align-items-center mb-2'>
					<div className='cursor-pointer me-2 plus__icon'>
						<select name='' id=''>
							<option value='10'>10</option>
							<option value='25'>25</option>
							<option value='50'>50</option>
						</select>
					</div>
					<div className='cursor-pointer me-2'>
						<i class='fa fa-filter plus__icon' aria-hidden='true'></i>
					</div>
					<div className='cursor-pointer'>
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
							{Array(10)
								.fill(1)
								.map((i) => (
									<tr className=''>
										<td>
											<img src='logo192.png' height={40} />
										</td>
										<td>Mark</td>
										<td>Otto@gmail.com</td>
										<td>9898989898</td>
										<td>Male</td>
										<td>
											<i class='fa fa-solid fa-circle red green'></i>
										</td>
										<td>
											{/* <i class='fa fa-ellipsis-v' aria-hidden='true'></i> */}
											<div className='d-flex align-items-center justify-content-center '>
												<div className='cursor-pointer' onClick={() => callAction('edit', i?.username)}>
													<i class='fa fa-pencil-square-o me-1' aria-hidden='true'></i>
												</div>
												<div className='cursor-pointer' onClick={() => callAction('delete', i?.id)}>
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
									<div className={` cursor-pointer me-2 ${currentPage === i ? 'active__page' : ''}`} onClick={() => pageClick(i)}>
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
