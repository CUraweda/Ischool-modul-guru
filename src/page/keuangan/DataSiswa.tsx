// import React from "react";
import { useEffect, useState } from 'react';
import { FaFileAlt, FaLock, FaLockOpen, FaSearch } from 'react-icons/fa';
import { Class, Raport, Student } from '../../midleware/api';
import { Store } from '../../store/Store';
import Swal from 'sweetalert2';
import { getAcademicYears, getCurrentAcademicYear } from '../../utils/common';
import { FaMoneyBill1Wave } from 'react-icons/fa6';

const getReport = (arr: any[], semester: any) => {
	const filt = arr.filter((ar) => ar.semester == semester);
	return filt.length ? filt[0] : null;
};

const DataSiswa = () => {
	const { token } = Store();

	// page states
	const [classes, setClasses] = useState<any[]>([]);
	const [students, setStudents] = useState<any[]>([]);
	const [pageMeta, setPageMeta] = useState<any>({ page: 0 });
	const [filter, setFilter] = useState({
		search: '',
		classId: '',
		academicYear: getCurrentAcademicYear(),
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

	const updateReportLockStatus = async (id: string, state: boolean) => {
		try {
			await Raport.updateStudentReportAccess(token, id);
			getStudents();

			Swal.fire({
				icon: 'success',
				title: 'Sukses',
				text: `Sukses ${state ? 'membuka kunci' : 'mengunci'} rapot`,
				showConfirmButton: false,
			});
		} catch {
			Swal.fire({
				icon: 'error',
				title: 'Gagal',
				text: `Gagal ${state ? 'membuka kunci' : 'mengunci'} rapot`,
				showConfirmButton: false,
			});
		}
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
							{getAcademicYears().map((val, i) => (
								<option value={val} key={i}>
									{val}
								</option>
							))}
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
													<FaMoneyBill1Wave />
												</button>

												<div className="dropdown dropdown-left dropdown-end">
													<button
														className="btn btn-ghost btn-sm join-item bg-cyan-500 text-white tooltip"
														data-tip="Kelola Rapot"
													>
														<FaFileAlt />
													</button>
													<ul
														tabIndex={0}
														className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
													>
														{[1, 2].map((smt) => {
															const report = getReport(dat.studentreports, smt);
															return (
																// <li>
																// 	<button
																<div className="form-control">
																	<label
																		onClick={() => {
																			updateReportLockStatus(report.id, !report.student_access);
																		}}
																		className={
																			'flex justify-between label !font-bold items-center ' +
																			(!report ? 'text-gray-400 !cursor-not-allowed' : '')
																		}
																	>
																		Semester {smt}
																		{report ? (
																			<div
																				className="tooltip"
																				data-tip={report.student_access ? 'Kunci rapot' : 'Buka kunci rapot'}
																			>
																				<button className="btn btn-square btn-sm">
																					{report.student_access ? (
																						<FaLockOpen className="swap-on text-success text-lg" />
																					) : (
																						<FaLock className="swap-off text-error text-lg" />
																					)}
																				</button>
																			</div>
																		) : (
																			''
																		)}
																	</label>
																</div>
																// 	</button>
																// </li>
															);
														})}
													</ul>
												</div>
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
