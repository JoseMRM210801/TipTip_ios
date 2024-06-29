import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ListRenderItem,
  InteractionManager,
} from 'react-native';

interface Item {
  Name: string;
  Id: string;
}

interface CustomSelectProps {
  items: Item[];
  onValueChange: (Id: Item) => void;
  placeholder: {label: string; value: string}; // Modificado aquí
  isLoading?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  items,
  onValueChange,
  placeholder,
  isLoading,
}) => {
  const [selectedValue, setSelectedValue] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  const handleSelectItem = useCallback(
    (item: Item) => {
      setSelectedValue(item);
      setModalVisible(false);
      onValueChange(item);
    },
    [onValueChange],
  );

  const ListItem = React.memo(({item, onPress}: any) => (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.item}>
      <Text style={styles.itemText}>{item.Name}</Text>
    </TouchableOpacity>
  ));

  const renderItem = useCallback(
    ({item}: any) => (
      <ListItem
        item={item}
        onPress={handleSelectItem}
        key={`unico-${item.Id}-${Math.random()}`}
      />
    ),
    [handleSelectItem],
  );
  useEffect(() => {
    if (!isLoading && items.length > 0) {
      setTimeout(() => {
        setIsInteractive(true);
      }, 1000);
    }
  }, [isLoading, items]);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.selectBox}>
        <Text style={styles.selectText}>
          {/*{selectedValue ? selectedValue.Name : placeholder}*/}
          {selectedValue ? selectedValue.Name : placeholder.label}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {!isInteractive ? (
              <Text style={{color: '#000'}}>Cargando...</Text>
            ) : (
              <FlatList
                data={items}
                keyExtractor={item => item.Id}
                renderItem={renderItem}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  selectBox: {
    padding: 10,
    height: 45,
    fontSize: 15,
    borderRadius: 21,
    fontWeight: '400',
    color: '#212529',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    width: '100%',
    marginBottom: 12,
    overflow: 'hidden',
  },
  selectText: {
    fontSize: 16,
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  item: {
    padding: 10,
    margin: 2,
    borderBottomWidth: 0.7,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});
