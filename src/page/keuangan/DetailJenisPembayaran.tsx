// import React from "react";
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaCheck, FaSearch, FaTrash } from 'react-icons/fa';
import { MdInsertPhoto } from 'react-icons/md';
import { Class } from '../../midleware/api';
import { Store } from '../../store/Store';
import Modal, { openModal } from '../../component/modal';
import { Select } from '../../component/Input';

const DetailJenisPembayaran = () => {
	const { token } = Store(),
		modalFormTambah = 'form-tambah-siswa';

	// data state
	const [classes, setClasses] = useState<any[]>([]);
	const [dataList, setDataList] = useState<any[]>([
		{
			student: {
				name: 'Kak Gem',
				nis: '123.123.123',
			},
			payment_bill: {
				name: 'Asuransi Juli 2024',
			},
			status: 'LUNAS',
			evidence_path: '/gambar.png',
			paidoff_at: '2023-12-04 12:43:24',
		},
		{
			student: {
				name: 'Ivan Gunawan',
				nis: '321.2121.21',
			},
			payment_bill: {
				name: 'Asuransi Juli 2024',
			},
			status: 'BELUM LUNAS',
			evidence_path: null,
			paidoff_at: null,
		},
	]);
	const [pageMeta, setPageMeta] = useState<any>({ page: 0 });
	const [filter, setFilter] = useState({
		page: 0,
		classId: '',
	});

	// UI states
	const [search, setSearch] = useState<string>('');

	const handleFilter = (key: string, value: string) => {
		const obj = {
			...filter,
			[key]: value,
		};
		if (key != 'page') obj['page'] = 0;
		setFilter(obj);
	};

	const getClasses = async () => {
		try {
			const res = await Class.showAll(token, 0, 1000);
			setClasses(res.data.data.result);
		} catch {}
	};

	useEffect(() => {
		getClasses();
	}, []);

	return (
		<>
			<Modal id={modalFormTambah}>
				<form action="">
					<h3 className="text-xl font-bold mb-6">Tambah Siswa</h3>
				</form>

				<Select label="Siswa" name="student_id" options={['Kak Gem', 'Ivan Gunawan', 'Genjot Wak']} />

				<div className="modal-action">
					<button className="btn btn-primary" type="submit">
						Simpan
					</button>
				</div>
			</Modal>

			<div className="w-full flex justify-center flex-col items-center p-3">
				<div className="w-full p-3 bg-white">
					{/* breadcrumbs  */}
					<div className="breadcrumbs text-sm">
						<ul>
							<li>
								<a>Home</a>
							</li>
							<li>
								<a>Pembayaran</a>
							</li>
							<li>Jenis Pembayaran</li>
							<li>Detail Jenis Pembayaran</li>
						</ul>
					</div>

					<div className="w-full flex justify-end my-3 gap-2">
						{/* search bar  */}
						<form
							onSubmit={(e) => {
								e.preventDefault();
							}}
							className="join"
						>
							<label className="input input-bordered flex items-center gap-2">
								<input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									type="text"
									placeholder="Cari Siswa"
									className="grow"
								/>
								<FaSearch />
							</label>
						</form>

						{/* filters  */}
						<select
							value={filter.classId}
							onChange={(e) => handleFilter('classId', e.target.value)}
							className="select select-bordered w-fit"
						>
							<option value={''}>Pilih Kelas</option>
							{classes.map((dat, i) => (
								<option value={dat.id} key={i}>
									{dat.class_name}
								</option>
							))}
						</select>

						<button onClick={() => openModal(modalFormTambah)} className="btn btn-ghost bg-blue-500 text-white">
							Tambah
						</button>
					</div>

					{/* data  */}
					<div className="overflow-x-auto">
						<table className="table table-zebra">
							{/* head */}
							<thead className="bg-blue-400">
								<tr>
									<th>No</th>
									<th>Nama</th>
									<th>NIS</th>
									<th>Pembayaran</th>
									<th>Status</th>
									<th>Bukti Bayar</th>
									<th>Tanggal Bayar</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{dataList.map((dat, i) => (
									<tr key={i}>
										<th>{i + 1}</th>
										<td>{dat.student?.name ?? '-'}</td>
										<td>{dat.student?.nis ?? '-'}</td>
										<td>{dat.payment_bill?.name ?? '-'}</td>
										<td>
											<p
												className={
													'font-extrabold ' +
													(dat.status == 'LUNAS' ? 'text-success' : '') +
													(dat.status == 'BELUM LUNAS' ? 'text-error' : '')
												}
											>
												{dat.status ?? '-'}
											</p>
										</td>
										<td>
											<button disabled={dat.evidence_path == null} className="btn btn-ghost btn-sm text-2xl ">
												<MdInsertPhoto />
											</button>
										</td>
										<td>{dat.paidoff_at ? moment(dat.paidoff_at).format('DD MMMM YYYY') : '-'}</td>

										<td>
											<div className="join">
												<button
													disabled={dat.status == 'LUNAS'}
													className="btn btn-ghost btn-sm join-item bg-success text-white tooltip"
													data-tip="Terima"
												>
													<FaCheck />
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

					{/* pagination control  */}
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

export default DetailJenisPembayaran;
