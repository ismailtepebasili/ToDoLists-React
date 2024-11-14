import { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 20px;
`;

const TextField = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #282b29;
  }
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 50px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 300px;
`;

const ListBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EditDeleteContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

interface ItemsProps {
  id: string;
  content: string;
}

function App() {
  const [items, setItems] = useState<ItemsProps[]>([]);
  const [newItemContent, setNewItemContent] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [inputEdit, setInputEdit] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const itemsContent = [...items];
    const [removedItem] = itemsContent.splice(result.source.index, 1);
    itemsContent.splice(result.destination.index, 0, removedItem);
    setItems(itemsContent);
  };

  const addItems = () => {
    if (!newItemContent.trim()) return;
    const listItemId = nanoid();
    const newList = {
      id: listItemId,
      content: newItemContent,
    };
    setItems([...items, newList]);
    setNewItemContent("");
  };

  const deleteItem = (id: string) => {
    setItems((items) => {
      return items.filter((item) => item.id !== id);
    });
  };

  const openEditModal = (id: string, content: string) => {
    setOpen(true);
    setInputEdit(content);
    setSelectedId(id);
  };

  const saveEditedItem = () => {
    const selectedItem = items.find((item) => item.id === selectedId);
    if (selectedItem) {
      selectedItem.content = inputEdit;
      setItems([...items]);
    }
    setOpen(false);
  };

  const closeEditModal = () => setOpen(false);

  return (
    <>
      <Container>
        <p>
          Yapmak istediğiniz hedeflerinizi aşağıdaki alana yazarak ekle butonuna
          tıklayın. <br /> Listedeki hedefleri düzenleyebilir, sırasını sürükle
          bırak yaparak değiştirebilir, dilerseniz kaldırabilirsiniz.
        </p>
        <InputContainer>
          <TextField
            type="text"
            value={newItemContent}
            onChange={(e) => {
              setNewItemContent(e.target.value);
            }}
            placeholder="Yeni bir madde ekleyin..."
          />
          <Button onClick={addItems}>Ekle</Button>
        </InputContainer>
        <ListContainer>
          <List>
            <h2>
              To-Do Lists <br /> (Yapılacaklar Listesi)
            </h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="myList">
                {(provider) => (
                  <div ref={provider.innerRef} {...provider.droppableProps}>
                    {items.map(({ id, content }: ItemsProps, index) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provider) => (
                          <ListBox
                            ref={provider.innerRef}
                            {...provider.draggableProps}
                            {...provider.dragHandleProps}
                          >
                            {content}
                            <EditDeleteContainer>
                              <Button
                                onClick={() => openEditModal(id, content)}
                              >
                                <FaEdit />
                              </Button>
                              <Button onClick={() => deleteItem(id)}>
                                <FaTrashAlt />
                              </Button>
                            </EditDeleteContainer>
                          </ListBox>
                        )}
                      </Draggable>
                    ))}
                    {provider.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </List>
        </ListContainer>
      </Container>
      {open && (
        <ModalBackground onClick={closeEditModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <TextField
              type="text"
              value={inputEdit}
              onChange={(e) => setInputEdit(e.target.value)}
            />
            <Button onClick={saveEditedItem}>Tamam</Button>
          </ModalContainer>
        </ModalBackground>
      )}
    </>
  );
}

export default App;
