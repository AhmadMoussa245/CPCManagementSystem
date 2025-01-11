#include <iostream>
using namespace std;
int main()
{
    int W,T;
    cin >> T;
    while(T--){
        cin>>W;
        if(W % 2 == 0)
            cout << "YES\n";
        else
            cout << "NO\n";
    }
    return 0;
}
