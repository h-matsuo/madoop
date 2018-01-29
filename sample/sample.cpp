/*
 * sample(x, y)
 * x^y を計算する
 */

#include <vector>

extern "C" {

  int sample(int x, int y) {
    std::vector<int> data(x, y);
    int result = 0;
    for(auto itr = data.begin(); itr != data.end(); ++itr) {
      result *= *itr;
    }
    return result;
  }

}
