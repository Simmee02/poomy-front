import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import colors from '../../config/colors';
import { fonts } from '../../config/fonts'; 
import ApiClient from './ApiClient';

const NamesetScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [isContentValid, setIsContentValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false); // 중복 확인 여부
  const [isDuplicate, setIsDuplicate] = useState(false); // 중복 여부

  const validateName = (input) => {
    const lengthValid = input.length <= 5 && input.length > 0;
    const contentValid = /^[가-힣]+$/.test(input);

    setIsLengthValid(lengthValid);
    setIsContentValid(contentValid);
    setName(input);
    setIsTouched(true);
    setIsDuplicateChecked(false); // 중복 확인 초기화
  };

  const clearInput = () => {
    setName('');
    setIsLengthValid(false);
    setIsContentValid(false);
    setIsTouched(false);
    setIsDuplicateChecked(false); // 중복 확인 초기화
  };

  const checkDuplicate = async () => {
    try {
      // 서버로 닉네임 중복 확인 요청
      const response = await ApiClient.post('/api/users/check/nickname', { nickname: name });
      if (response.data.isDuplicate) {
        setIsDuplicate(true);
        Alert.alert('중복된 닉네임', '이미 사용 중인 닉네임입니다.');
      } else {
        setIsDuplicate(false);
        Alert.alert('사용 가능한 닉네임', '해당 닉네임을 사용할 수 있습니다.');
      }
      setIsDuplicateChecked(true);
    } catch (error) {
      console.error('Error during nickname check:', error);
      Alert.alert('오류', '닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const isAllChecked = isLengthValid && isContentValid && isDuplicateChecked && !isDuplicate;

  const getIcon = (valid) => {
    if (!isTouched) return require('../../assets/check_gray.png');
    return valid ? require('../../assets/check_green.png') : require('../../assets/check_red.png');
  };

  const getIcon2 = (valid, isChecked) => {
    if (!isChecked) {
      return require('../../assets/check_gray.png'); // 중복 확인이 안 됐을 때는 회색
    }
    return valid ? require('../../assets/check_green.png') : require('../../assets/check_red.png'); // 중복 확인 후 유효성에 따라 색상
  };
  
  const handleSaveNickname = async () => {
    try {
      const response = await ApiClient.post('/api/users/nickname', {
        nickname: name,  // 여기서 name 변수를 사용합니다.
      });
  
      if (response.data.success) {
        //Alert.alert('성공', '닉네임이 저장되었습니다.');
        navigation.navigate('PreferSelect');
      } else {
        Alert.alert('오류', '닉네임을 다시 설정해주세요');
      }
    } catch (error) {
      console.error('Error during nickname submission:', error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/left.png')} style={styles.backIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Image source={require('../../assets/progress_bar.png')} style={styles.image} />
        <Text style={styles.text}>사용하실 이름을 {'\n'}입력해주세요.</Text>
        
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              !isTouched ? styles.default : (isLengthValid && isContentValid ? styles.valid : styles.invalid),
            ]}
            value={name}
            onChangeText={validateName}
            placeholder="5자 이내로 입력해 주세요"
            placeholderTextColor={!isTouched ? colors.Gray400 : (isLengthValid && isContentValid ? colors.Gray400: colors.Gray400)}
            onBlur={() => setIsTouched(true)}
          />
          {/* {name.length > 0 && (
            <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
              <Image source={require('../../assets/x.png')} style={styles.clearIcon} />
            </TouchableOpacity>
          )} */}

          {/* 닉네임 중복 확인 버튼 */}
          <TouchableOpacity 
            style={isDuplicateChecked ? styles.duplicateCheckButtonActive : styles.duplicateCheckButton}
            onPress={checkDuplicate}
          >
            <Text style={styles.duplicateCheckButtonText}>중복확인</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.validationContainer}>
          <Image source={getIcon(isLengthValid)} style={styles.icon} />
          <Text style={[
            styles.validationText,
            !isTouched ? styles.defaultText : (isLengthValid ? styles.validText : styles.invalidText),
          ]}>
            한글 최대 5자
          </Text>
        </View>
        <View style={styles.validationContainer}>
          <Image source={getIcon(isContentValid)} style={styles.icon} />
          <Text style={[
            styles.validationText,
            !isTouched ? styles.defaultText : (isContentValid ? styles.validText : styles.invalidText),
          ]}>
            공백, 쉼표, 숫자, 특수기호 불가
          </Text>
        </View>

        <View style={styles.validationContainer}>
        <Image source={getIcon2(!isDuplicate, isDuplicateChecked)} style={styles.icon} />
        <Text style={[
          styles.validationText,
          !isDuplicateChecked ? styles.defaultText : (isDuplicate ? styles.duplicateInvalidText : styles.duplicateValidText),
          ]}>
          {!isDuplicateChecked ? '닉네임 중복확인을 해주세요' : (isDuplicate ? '이미 사용 중인 닉네임입니다.' : '사용 가능한 닉네임입니다.')}
        </Text>
        </View>


        <TouchableOpacity
          style={[styles.button, isAllChecked ? styles.buttonActive : styles.buttonInactive]}
          disabled={!isAllChecked}
          onPress={handleSaveNickname}
        >
          <Text style={[styles.buttonText, isAllChecked ? styles.buttonTextActive : styles.buttonTextInactive]}>
            다음
          </Text>
          
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60, 
    backgroundColor:colors.Ivory100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    marginLeft: -10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  image: {
    width: 48,
    height: 8,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    ...fonts.Heading1,
    textAlign: 'left',
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.Gray300,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "500"
  },
  clearButton: {
    padding: 5,
  },
  clearIcon: {
    width: 24,
    height: 24,
  },
  default: {
    borderBottomColor: colors.Gray400,
  },
  valid: {
    borderBottomColor: colors.Green900,
  },
  invalid: {
    borderBottomColor: colors.Error,
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },
  icon: {
    width: 14,
    height: 14,
    marginRight: 10,
  },

  validationText: {
    fontSize: 14,
    ...fonts.Body4,
  },

  defaultText: {
    color: colors.Gray400,
    ...fonts.Body4,
  },

  validText: {
    color: colors.Green900,
    ...fonts.Body4,
  },

  invalidText: {
    color: colors.Error,
    ...fonts.Body4,
  },

  duplicateCheckButton: {
    // backgroundColor: colors.Gray100,
    borderColor: colors.Gray200,  // 테두리 색상
    borderWidth: 1,               // 테두리 두께 추가
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: colors.Gray900,
    alignItems: 'center',
    marginLeft: 10,    
  },
  
  duplicateCheckButtonActive: {
    borderColor: colors.Gray300,  // 테두리 색상
    borderWidth: 1,               // 테두리 두께 추가
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: colors.Gray900,
    alignItems: 'center',
    marginLeft: 10,    
  },

  duplicateCheckButtonText: {
    color: colors.Gray200,
    fontSize: 15,
  },

  button: {
    width: 350,
    height: 48,
    position: 'absolute',
    bottom: 94,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonInactive: {
    backgroundColor: colors.Gray100,
  },
  buttonActive: {
    backgroundColor: colors.Green900,
  },
  buttonText: {
    fontSize: 15,
  },
  buttonTextActive: {
    color: colors.Ivory100,
  },
  buttonTextInactive: {
    color: colors.Gray500,
  },
  duplicateValidText: {
    color: colors.Green900,  // 사용 가능한 닉네임일 때 초록색으로 표시
    ...fonts.Body4,
  },
  duplicateInvalidText: {
    color: colors.Error,  // 중복된 닉네임일 때 빨간색으로 표시
    ...fonts.Body4,
  },
  validationText: {
    fontSize: 14,
    ...fonts.Body4,
    color: colors.Gray400,  // 닉네임 중복 확인 전 회색으로 표시
  },
});

export default NamesetScreen;
