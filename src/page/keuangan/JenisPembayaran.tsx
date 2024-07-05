// import React from "react";
import { FaRegFileAlt, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaPencil } from 'react-icons/fa6';
import { useState } from 'react';
import moment from 'moment';
import { getAcademicYears, moneyFormat } from '../../utils/common';
import Modal, { openModal, closeModal } from '../../component/modal';
import { Input, Select } from '../../component/Input';

const JenisPembayaran = () => {
	const navigate = useNavigate();
	const modalForm = 'form-jenis-pembayaran';

	// data state
	const [dataIdxInForm, setDataIdxInForm] = useState<any>(null);
	const [dataList, setDataList] = useState<any[]>([
		{
			id: 1,
			name: 'Asuransi Juli 2024',
			payment_post: {
				name: 'Asuransi',
			},
			level: 'SD',
			class: {
				name: 'SD Pintar Juara',
			},
			student: {
				name: 'Keyshari',
			},
			total: 800000,
			academic_year: '2023/2024',
			due_date: '2023-12-04 12:43:24',
		},
		{
			id: 1,
			name: 'SPP Juni 2024',
			payment_post: {
				name: 'SPP',
			},
			level: 'SMP',
			total: 1200000,
			academic_year: '2023/2024',
			due_date: '2023-12-04 12:43:24',
		},
	]);
	const [pageMeta, setPageMeta] = useState<any>({ page: 0 });
	const [filter, setFilter] = useState({
		page: 0,
	});

	const handleFilter = (key: string, value: string) => {
		const obj = {
			...filter,
			[key]: value,
		};
		if (key != 'page') obj['page'] = 0;
		setFilter(obj);
	};

	const handleDetail = () => {
		navigate('/keuangan/jenis-pembayaran/detail');
	};

	return (
		<>
			<Modal id={modalForm}>
				<form action="">
					<h3 className="text-xl font-bold mb-6">{dataIdxInForm ? 'Edit' : 'Tambah'} Jenis Pembayaran</h3>

					<Input label="Keterangan" name="name" />

					<Select label="Pos pembayaran" name="payment_post_id" options={['SPP', 'Asuransi']} />

					<Input type="date" label="Jatuh tempo" name="due_date" />

					<Select label="Tahun pembelajaran" name="academic_year" options={getAcademicYears()} />

					<Input type="number" label="Total" name="total" />

					<Select label="Jenjang" name="level" options={['TK', 'SD', 'SMP']} />

					<div className="divider">Khusus</div>

					<Select
						label="Kelas"
						name="class_id"
						helpMessage="Opsional"
						options={['TK A', 'TK B', 'SD A', 'SD B', 'SMP A', 'SMP B']}
					/>

					<Select
						label="Siswa"
						name="student_id"
						helpMessage="Opsional"
						options={['Kak Gem', 'Ivan Gunawan', 'Genjot Wak']}
					/>

					<div className="modal-action">
						<button className="btn" type="button">
							Atur ulang
						</button>
						<button className="btn btn-primary" type="submit">
							Simpan
						</button>
					</div>
				</form>
			</Modal>

			<div className="w-full flex justify-center flex-col items-center p-3">
				<span className="font-bold text-xl">JENIS PEMBAYARAN</span>
				<div className="w-full p-3 bg-white">
					<div className="w-full flex justify-end my-3 gap-2">
						<select className="select select-bordered w-32">
							<option>Filter</option>
							<option>Han Solo</option>
							<option>Greedo</option>
						</select>
						<button onClick={() => openModal(modalForm)} className="btn btn-ghost bg-blue-500 text-white">
							Tambah
						</button>
					</div>
					<div className="overflow-x-auto">
						<table className="table table-zebra">
							{/* head */}
							<thead className="bg-blue-400">
								<tr>
									<th>No</th>
									<th>Keterangan</th>
									<th>POS</th>
									<th>Jatuh Tempo</th>
									<th>Siswa</th>
									<th>Total</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{dataList.map((dat, i) => (
									<tr key={i}>
										<th>{i + 1}</th>
										<td>
											<p className="text-lg">{dat.name}</p>
											<p className="text-xs text-gray-400">{dat.academic_year}</p>
										</td>
										<td>{dat.payment_post?.name ?? '-'}</td>
										<td>{dat.due_date ? moment(dat.due_date).format('DD MMMM YYYY') : '-'}</td>
										<td>
											<div className="flex flex-wrap gap-2 max-w-40">
												<div className="badge badge-primary">{dat.level}</div>
												{dat.class && <div className="badge badge-secondary">{dat.class.name}</div>}
											</div>
										</td>
										<td>
											<p className="text-xl font-bold">{dat.total ? moneyFormat(dat.total) : 'Rp -'}</p>
										</td>

										<td>
											<div className="join">
												<button
													className="btn btn-ghost btn-sm join-item bg-blue-500 text-white tooltip"
													data-tip="Detail"
													onClick={handleDetail}
												>
													<FaRegFileAlt />
												</button>
												<button
													className="btn btn-ghost btn-sm join-item bg-orange-500 text-white tooltip"
													data-tip="Edit"
												>
													<FaPencil />
												</button>
												<button
													className="btn btn-ghost btn-sm join-item bg-red-500 text-white tooltip"
													data-tip="Hapus"
												>
													<FaTrash />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="w-full justify-end flex mt-3">
						<div className="join">
							<button
								className="join-item btn"
								onClick={() => handleFilter('page', (pageMeta.page - 1).toString())}
								disabled={pageMeta.page == 0}
							>
								«
							</button>
							<button className="join-item btn">Page {pageMeta.page + 1}</button>
							<button
								className="join-item btn"
								onClick={() => handleFilter('page', (pageMeta.page + 1).toString())}
								disabled={pageMeta.page + 1 == pageMeta.totalPage}
							>
								»
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default JenisPembayaran;
