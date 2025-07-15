import { View } from 'react-native';

/**
 * 컴포넌트 간 간격을 주기 위한 View (== Flutter Gap Widget)
 * @param size 간격 크기 (height, width 동일)
 */
export default function Gap({ size }: { size: number }) {
  return <View style={{ height: size, width: size }}></View>;
}
