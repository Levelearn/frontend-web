import DataTable from 'datatables.net-react';
import { useEffect, useState } from 'react';
import api from '../api/api';
import PlaceholderImg from '../images/placeholder-image.png';
import { supabase } from '../api/supabase';
import { AddTradeDto, TradeDto, UpdateTradeDto } from '../dto/TradeDto';
import Swal from 'sweetalert2';

const Trade: React.FC = () => {
  const [data, setData] = useState<TradeDto[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [badgeType, setBadgeType] = useState<string>('BEGINNER');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tradeId, setTradeId] = useState<number>(0);

  const selectStyle = `
  .custom-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M8 10l4 4 4-4'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 30px;
    padding-right: 28px;
  }
  .swal2-container {
    z-index: 10000;
  }
  `;

  const fetchData = async () => {
    try {
      const response = await api.get<TradeDto[]>('/trade');
      setData(response.data);
    } catch (err) {
      console.error('Error while getting trade: ', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const truncateText = (text: string, wordLimit: number): string => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + ' ...';
    }
    return text;
  };

  const handleClearForm = () => {
    setTitle('');
    setTradeId(0);
    setDescription('');
    setBadgeType('BEGINNER');
    setImageFile(null);
    setImagePreview(null);
    setOldImageUrl(null);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleEditModal = (data: TradeDto) => {
    setTradeId(data.id);
    setTitle(data.title);
    setDescription(data.description);
    setBadgeType(data.requiredBadgeType);
    setOldImageUrl(data.image);
    setImagePreview(data.image);
    setIsEditModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Membuat URL untuk preview
    } else {
      setImageFile(null);
      setImagePreview(null); // Menghapus preview jika tidak ada file
    }
  };

  const isFormValid = () => {
      if (!title || !description || !badgeType) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Please fill in all required fields (Title, Description, Type)',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return false;
      }
      return true;
    };

  const handleAddTrade = async () => {
    if (!isFormValid()) {
      return;
    }

    if (!imageFile) {
      alert('Please select an image.');
      return;
    }

    const fileName = `${Date.now()}-${imageFile.name}`;
    const filePath = `trade/${fileName}`;

    try {
      const payload: AddTradeDto = {
        title: title,
        description: description,
        requiredBadgeType: badgeType,
        image: '',
      };

      const response = await api.post('/trade', payload);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assignment')
        .upload(filePath, imageFile);

      if (uploadError) {
        if (uploadError instanceof Error) {
          console.error('Error uploading image:', uploadError.message);
        } else {
          console.error('Unknown error uploading image:', uploadError);
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to upload image',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        await api.delete(`/trade/${response.data.trade.id}`);
        return;
      }

      const imageUrl = `https://vymbuulgynmxbsfkuvvy.supabase.co/storage/v1/object/public/assignment/${filePath}`;

      const imagePayload: UpdateTradeDto = {
        image: imageUrl,
      };

      await api.put(`/trade/${response.data.trade.id}`, imagePayload);

      handleClearForm();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Trade added successfully',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      fetchData();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add trade',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      console.error('Error while adding badge: ', err);
    }
  };

  const handleEditTrade = async () => {
    let imageUrl = oldImageUrl;

    if (imageFile) {
      if (oldImageUrl) {
        try {
          const oldFilePath = oldImageUrl.split('/assignment/')[1];
          if (oldFilePath) {
            const { error: deleteError } = await supabase.storage
              .from('assignment')
              .remove([oldFilePath]);

            if (deleteError) {
              console.error('Error deleting old image:', deleteError);
              alert('Failed to delete old image.');
              return;
            }
          }
        } catch (deleteErr) {
          handleClearForm();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete old image',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          console.error('Error deleting old image:', deleteErr);
          alert('Failed to delete old image.');
          return;
        }
      }

      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = `trade/${fileName}`;

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assignment')
          .upload(filePath, imageFile);

        if (uploadError) {
          handleClearForm();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to upload new image',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          console.error('Error uploading new image:', uploadError);
          return;
        }

        imageUrl = `https://vymbuulgynmxbsfkuvvy.supabase.co/storage/v1/object/public/assignment/${filePath}`;
      } catch (uploadErr) {
        handleClearForm();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to upload new image',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        console.error('Error uploading new image:', uploadErr);
        return;
      }
    }

    const uploadData: UpdateTradeDto = {
      title: title !== '' ? title : undefined,
      description: description !== '' ? description : undefined,
      requiredBadgeType: badgeType !== '' ? badgeType : undefined,
      image: imageUrl || undefined,
    };

    try {
      await api.put<UpdateTradeDto>(`/trade/${tradeId}`, uploadData);

      handleClearForm();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Trade updated successfully',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      fetchData();
    } catch (err) {
      handleClearForm();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update trade',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      console.error('Error while updating badge: ', err);
    }
  };

  const handleDeleteTrade = async (id: number, imageUrl?: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (imageUrl) {
            const oldFilePath = imageUrl.split('/assignment/')[1];
            if (oldFilePath) {
              const { error: deleteStorageError } = await supabase.storage
                .from('assignment')
                .remove([oldFilePath]);

              if (deleteStorageError) {
                console.error(
                  'Error deleting image from storage:',
                  deleteStorageError,
                );
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Failed to delete image',
                  timer: 1500,
                  timerProgressBar: true,
                  showConfirmButton: false,
                });
                return;
              }
            }
          }

          await api.delete(`/trade/${id}`);
          
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Trade delete successfully',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          fetchData();
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete trade',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          console.error('Error while deleting badge: ', err);
        }
      }
    });
  };

  const columns = [
    { data: 'title', title: 'Title' },
    {
      data: 'description',
      title: 'Description',
      createdCell: (cell: HTMLTableCellElement, cellData: string) => {
        cell.textContent = truncateText(cellData, 10);
      },
    },
    {
      data: 'requiredBadgeType',
      title: 'Required',
    },
    {
      data: 'createdAt',
      title: 'Created At',
      visible: false,
    },
    {
      data: null,
      title: 'Actions',
      orderable: false,
      searchable: false,
      createdCell: (cell: HTMLTableCellElement, _: any, rowData: TradeDto) => {
        cell.innerHTML = '';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex space-x-2';

        const createButton = (
          buttonColor: string,
          svgPath: string,
          title: string,
          onClick: () => void,
        ) => {
          const button = document.createElement('button');
          button.className = `px-4.5 py-2.5 ${buttonColor} text-white rounded-md`;
          button.title = title;

          const svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg',
          );
          svg.setAttribute('viewBox', '0 0 512 512');
          svg.setAttribute('width', '20');
          svg.setAttribute('height', '20');
          svg.setAttribute('fill', 'white');
          svg.innerHTML = svgPath;

          button.appendChild(svg);
          button.onclick = onClick;
          return button;
        };

        const editButton = createButton(
          'bg-warning',
          `<path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/>`,
          'Edit',
          () => handleEditModal(rowData),
        );

        const deleteButton = createButton(
          'bg-danger',
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>`, // Example SVG for view
          'Delete',
          () => handleDeleteTrade(rowData.id, rowData.image),
        );

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        cell.appendChild(buttonContainer);
      },
    },
  ];

  return (
    <div>
      <div className="pb-6 text-xl font-semibold">Trade</div>
      <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
        <style>{selectStyle}</style>
        <h1 className="text-2xl font-bold pb-5">Trade Management</h1>
        <hr />
        <div className="text-end mt-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 bg-primary text-center font-medium text-white hover:bg-opacity-90"
          >
            Add Trade
          </button>
        </div>
        <div className="max-w-full overflow-x-auto ">
          <DataTable
            data={data}
            columns={columns}
            className="display nowrap w-full"
            options={{
              order: [[3, 'desc']], // Urutkan berdasarkan kolom ke-5 (createdAt) secara descending
            }}
          />
        </div>

        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-9999 overflow-y-auto">
            <div
              className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
              style={{ width: '800px', maxWidth: '90%' }}
            >
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Add Trade
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-black dark:text-white"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      placeholder="Input Name"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="role"
                      className="mb-3 block text-black dark:text-white"
                    >
                      Type
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={badgeType}
                      className="custom-select relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent py-3 px-5 pr-10 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input custom-select"
                      onChange={(e) =>
                        setBadgeType(
                          e.target.value as
                            | 'BEGINNER'
                            | 'INTERMEDIATE'
                            | 'ADVANCE',
                        )
                      }
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCE">ADVANCE</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-black dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      rows={5}
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      placeholder="Input Description"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="image"
                      className="mb-3 block text-black dark:text-white"
                    >
                      Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      onChange={handleImageChange}
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="border w-full h-60 object-cover rounded-lg mt-5"
                      />
                    ) : (
                      <img
                        src={PlaceholderImg}
                        alt="Placeholder"
                        className="border w-full h-60 object-cover rounded-lg mt-5"
                      />
                    )}
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => handleClearForm()}
                      className="bg-gray-400 hover:bg-opacity-90 text-gray-800 font-medium py-2 px-4 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleAddTrade().then();
                      }}
                      className="bg-primary hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-9999 overflow-y-auto">
            <div
              className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
              style={{ width: '800px', maxWidth: '90%' }}
            >
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Add Trade
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-black dark:text-white"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      placeholder="Input Name"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="role"
                      className="mb-3 block text-black dark:text-white"
                    >
                      Type
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={badgeType}
                      className="custom-select relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent py-3 px-5 pr-10 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input custom-select"
                      onChange={(e) =>
                        setBadgeType(
                          e.target.value as
                            | 'BEGINNER'
                            | 'INTERMEDIATE'
                            | 'ADVANCE',
                        )
                      }
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCE">ADVANCE</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-black dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      rows={5}
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      placeholder="Input Description"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="image"
                      className="mb-3 block text-black dark:text-white"
                    >
                      Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                      onChange={handleImageChange}
                    />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="border w-full h-60 object-cover rounded-lg mt-5"
                      />
                    ) : (
                      <img
                        src={PlaceholderImg}
                        alt="Placeholder"
                        className="border w-full h-60 object-cover rounded-lg mt-5"
                      />
                    )}
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => handleClearForm()}
                      className="bg-gray-400 hover:bg-opacity-90 text-gray-800 font-medium py-2 px-4 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleEditTrade().then();
                      }}
                      className="bg-primary hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trade;
