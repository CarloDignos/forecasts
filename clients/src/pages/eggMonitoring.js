import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Form, Container, Row, Col, Button, Modal, Table, Pagination } from 'react-bootstrap';

import * as XLSX from 'xlsx';

function EggCollection() {
  const [eggCollections, setEggCollections] = useState([]);
  const [breedingData, setBreedingData] = useState([]);
  const [selectedChickenType, setSelectedChickenType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    chickenTypeId: '',
    batch: '',
    date: '',
    goodEgg: '',
    spoiltEgg: '',
    collectedEgg: '',
    notes: '',
  });
  const [editMode, setEditMode] = useState(false);
  const user = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10); // Number of items per page

const paginatedData = eggCollections.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const handlePageChange = (page) => {
  if (page < 1 || page > Math.ceil(eggCollections.length / itemsPerPage)) return;
  setCurrentPage(page);
};


  const bulkCreateEggCollections = async (data) => {
    try {
      const response = await axios.post('http://localhost:5001/eggCollection/bulkCreate', {
        userId: user._id,
        data,
      });
      setEggCollections([...eggCollections, ...response.data]);
      alert('Egg collections imported successfully!');
    } catch (error) {
      console.error('Bulk import failed:', error.response?.data || error.message);
      alert('Failed to import egg collections.');
    }
  };
  
  

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet).map((row, index) => {
            let validDate = null;

            if (row.date) {
                const excelSerialDate = Number(row.date);
                if (!isNaN(excelSerialDate)) {
                    // Convert Excel serial date to ISO
                    validDate = new Date((excelSerialDate - 25569) * 86400 * 1000).toISOString();
                } else {
                    const parsedDate = new Date(row.date);
                    if (!isNaN(parsedDate.getTime())) {
                        validDate = parsedDate.toISOString();
                    }
                }
            }

            return { ...row, date: validDate || null };
        });

        bulkCreateEggCollections(jsonData);
    };
    reader.readAsArrayBuffer(file);
};

  

  // Fetch egg collections and breeding data
  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      axios
        .get(`http://localhost:5001/eggCollection?userId=${user._id}`)
        .then((response) => {
          setEggCollections(response.data);
        })
        .catch((error) => {
          console.error('Error fetching egg collections:', error.message);
        });
  
      axios
        .get(`http://localhost:5001/breeding/breedingGetAll?userId=${user._id}`)
        .then((response) => {
          setBreedingData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching breeding data:', error.message);
        });
    };
  
    // Fetch data immediately on mount
    fetchData();
  
    // Set up interval to refresh data every 2 seconds
    const intervalId = setInterval(fetchData, 2000);
  
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [user._id]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };  

  const handleAdd = () => {
    setFormData({
      userId: user._id,
      chickenTypeId: '',
      batch: '',
      date: '',
      goodEgg: '',
      spoiltEgg: '',
      collectedEgg: '',
      notes: '',
    });
    setSelectedChickenType('');
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (collection) => {
    const { chickenTypeId, ...rest } = collection;
    const selectedChickenName = breedingData.find((data) => data._id === chickenTypeId)?.selectedChicken || '';
    setFormData({ chickenTypeId, ...rest });
    setSelectedChickenType(selectedChickenName);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/eggCollection/delete/${id}`);
      setEggCollections(eggCollections.filter((collection) => collection._id !== id));
    } catch (error) {
      console.error('Failed to delete:', error.message);
    }
  };

  const handleSubmit = async () => {
    if (!formData.batch) {
      alert('Please select a batch before submitting.');
      return;
    }

    try {
      if (editMode) {
        const { _id, ...data } = formData;
        const response = await axios.put(`http://localhost:5001/eggCollection/update/${_id}`, data);
        setEggCollections(
          eggCollections.map((collection) =>
            collection._id === _id ? response.data : collection
          )
        );
      } else {
        const response = await axios.post(`http://localhost:5001/eggCollection/create`, formData);
        setEggCollections([...eggCollections, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save:', error.message);
    }
  };
  const filteredBatches = breedingData.filter(
    (data) => data._id === formData.chickenTypeId
  );
  
  console.log('Filtered Batches:', filteredBatches);

  return (
    <Container>
      <h1 className="text-center">Egg Collection</h1>
      <Row>
        <Col>
          <Button variant="primary" onClick={handleAdd}>
            Add Egg Collection
          </Button>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Upload CSV/Excel</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </Form.Group>
        </Col>
      </Row>
      <Table striped bordered hover className="mt-3">
  <thead>
    <tr className="text-center">
      <th>Chicken Type</th>
      <th>Batch</th>
      <th>Date</th>
      <th>Good Eggs</th>
      <th>Spoilt Eggs</th>
      <th>Collected Eggs</th>
      <th>Notes</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
  {paginatedData.map((collection) => {
    const chickenType = breedingData.find(
      (data) => data._id === collection.chickenTypeId._id // Extract `_id` from `chickenTypeId`
    );
    return (
      <tr key={collection._id}>
        <td>{chickenType?.selectedChicken || 'Unknown'}</td>
        <td>{collection.batch}</td>
        <td>{new Date(collection.date).toLocaleDateString()}</td>
        <td>{collection.goodEgg}</td>
        <td>{collection.spoiltEgg}</td>
        <td>{collection.collectedEgg}</td>
        <td>{collection.notes}</td>
        <td className="text-center">
          <Button variant="warning" className="me-2" onClick={() => handleEdit(collection)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => handleDelete(collection._id)}>
            Delete
          </Button>
        </td>
      </tr>
    );
  })}
</tbody>

</Table>
<Pagination className="justify-content-center">
  <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
  <Pagination.Item active>{`Page ${currentPage} of ${Math.ceil(eggCollections.length / itemsPerPage)}`}</Pagination.Item>
  <Pagination.Next
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === Math.ceil(eggCollections.length / itemsPerPage)}
  />
  <Pagination.Last
    onClick={() => handlePageChange(Math.ceil(eggCollections.length / itemsPerPage))}
    disabled={currentPage === Math.ceil(eggCollections.length / itemsPerPage)}
  />
</Pagination>


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Egg Collection' : 'Add Egg Collection'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Chicken Type</Form.Label>
              <Form.Control
                as="select"
                name="chickenTypeId"
                value={formData.chickenTypeId}
                onChange={(e) => {
                  handleInputChange(e);
                  const selectedChickenName = breedingData.find((data) => data._id === e.target.value)?.selectedChicken || '';
                  setSelectedChickenType(selectedChickenName);
                }}
              >
                <option value="">Select...</option>
                {breedingData.map((data) => (
                  <option key={data._id} value={data._id}>
                    {data.selectedChicken}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Batch</Form.Label>
              <Form.Control
                as="select"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                disabled={!formData.chickenTypeId || filteredBatches.length === 0}
              >
                <option value="">Select...</option>
                {filteredBatches.length > 0 && (
                  <option value={filteredBatches[0].batch}>
                    {filteredBatches[0].batch}
                  </option>
                )}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Good Eggs</Form.Label>
              <Form.Control
                type="number"
                name="goodEgg"
                value={formData.goodEgg}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Spoilt Eggs</Form.Label>
              <Form.Control
                type="number"
                name="spoiltEgg"
                value={formData.spoiltEgg}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Collected Eggs</Form.Label>
              <Form.Control
                type="number"
                name="collectedEgg"
                value={formData.collectedEgg}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editMode ? 'Save Changes' : 'Add Collection'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EggCollection;
