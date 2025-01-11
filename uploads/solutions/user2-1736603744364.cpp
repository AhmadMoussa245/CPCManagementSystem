#include <iostream>
using namespace std;
int main()
{
    int W,T;
    cin >> T;
    while(T--){
        cin>>W;
        if(W % 2 == 0 && W>2)
            cout << "YES\n";
        else
            cout << "NO\n";
    }
    return 0;
}
