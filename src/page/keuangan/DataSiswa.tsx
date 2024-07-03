// import React from "react";
import { useEffect, useState } from 'react';
import { FaLock, FaLockOpen, FaRegFileAlt, FaSearch } from 'react-icons/fa';
import { Class, Student } from '../../midleware/api';
import { Store } from '../../store/Store';
import Swal from 'sweetalert2';

const DataSiswa = () => {
	const { token } = Store();

	// page states
	const [classes, setClasses] = useState<any[]>([]);
	const [students, setStudents] = useState<any[]>([]);
	const [pageMeta, setPageMeta] = useState<any>({ page: 0 });
	const [filter, setFilter] = useState({
		search: '',
		classId: '',
		academicYear: '',
		page: 0,
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

	const getStudents = async () => {
		try {
			const res = await Student.GetStudents(token, filter.search, filter.classId, filter.academicYear, filter.page);

			const { result, ...meta } = res.data.data;

			setStudents(result);
			setPageMeta(meta);
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Gagal Mengambil data siswa, silakan refresh halaman!',
			});
		}
	};

	const getClasses = async () => {
		try {
			const res = await Class.showAll(token, 0, 1000);
			setClasses(res.data.data.result);
		} catch {}
	};

	// entry point
	useEffect(() => {
		getStudents();
		getClasses();
	}, [filter]);

	return (
		<>
			<div className="w-full flex justify-center flex-col items-center p-3">
				<span className="font-bold text-xl">DATA SISWA</span>
				<div className="w-full p-3 bg-white">
					<div className="w-full gap-3 flex justify-end my-3">
						<select
							value={filter.classId}
							onChange={(e) => handleFilter('classId', e.target.value)}
							className="select select-bordered w-32"
						>
							<option value={''}>Pilih Kelas</option>
							{classes.map((dat, i) => (
								<option value={dat.id} key={i}>
									{dat.class_name}
								</option>
							))}
						</select>
						<select
							value={filter.academicYear}
							onChange={(e) => handleFilter('academicYear', e.target.value)}
							className="select select-bordered w-32"
						>
							<option value={''}>Pilih Tahun Ajar</option>
							<option value={'2023/2024'}>2023/2024</option>
							<option value={'2024/2025'}>2024/2025</option>
							<option value={'2025/2026'}>2025/2026</option>
						</select>
						<div className="join">
							<input
								type="text"
								placeholder="Cari Siswa"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								onKeyDown={(e) => (e.key == 'Enter' ? handleFilter('search', search) : null)}
								className="input input-bordered w-full max-w-xs join-item"
							/>
							<button className="btn btn-ghost bg-blue-500 join-item text-white">
								<FaSearch />
							</button>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="table table-zebra">
							{/* head */}
							<thead className="bg-blue-400">
								<tr>
									<th>No</th>
									<th>Name</th>
									<th>NIS</th>
									<th>Kelas</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{students.map((dat, i) => (
									<tr key={i}>
										<th>{i + 1}</th>
										<td>{dat.student?.full_name ?? '-'}</td>
										<td>{dat.student?.nis ?? '-'}</td>
										<td>{dat.class?.class_name ?? '-'}</td>
										<td>
											<div className="join">
												<button
													className="btn btn-ghost btn-sm join-item bg-blue-500 text-white tooltip"
													data-tip="Detail Pembayaran"
												>
													<FaRegFileAlt />
												</button>
												<button
													className="btn btn-ghost btn-sm join-item bg-red-500 text-white tooltip"
													data-tip="Buka Kunci Raport"
												>
													<FaLock />
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

export default DataSiswa;
