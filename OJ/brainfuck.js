package interpreter;
 
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
 
public class Test
{
 
    /**
     * 测试例子：+++++[>++++++++++<-]>.+++.+++.--.++.-.------.+++++.
     * 测试例子：++++++++++[>+++++++++>++++++++>+++++++<<<-]>---.>+.---.-.-.>+.-----.
     * 测试例子：++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.
     * 测试例子：++++++[>++++++[>++++++[>++++++[>+++++[>++++++<-]<-]<-]<-]<-]>++[>+++++[>++++++[>+++++[>------<-]<-]<-]<-]>>+++[>++[>-----<-]<-]>>-.<<<<++++[>++++[>++++[>+++++[>+++++<-]<-]<-]<-]>>>++[>+++++++<-]>.
     * 测试例子：>>>><++++++++++[>+++++<-]>-.<<+++++++[>++++++++<-]>.-.>-.++.<--.>-.<.>+.<<<<++[>++++++[>++++++++<-]>+.<++++++[>--------<-]>-<<-]
     */
 
    public static void main(String[] args)
    {
        List<Integer> finallyResult=new ArrayList<Integer>();//存储最后的解析结果
        List<Integer> middleResult=new ArrayList<Integer>();//在计算过程中的结果
        List<Integer> middleFlag=new ArrayList<Integer>();//在计算过程中的状态
        middleResult.add(0);//过程初始化
        middleFlag.add(0);//过程状态初始化
        int middleIndex=0;//过程集合的下标
        System.out.print("请输入待解析的QQ号：");
        Scanner input=new Scanner(System.in);
        String temp=input.nextLine();//输入待解析的QQ号
        input.close();//关闭输入流
        char[] interpreter=temp.toCharArray();//数组解析器
        int len=interpreter.length;//输入字符的长度
        boolean flag=true;//解析结果的转态，true为成功，false表示失败
        for(int i=0;i<len;i++)
        {
            switch(interpreter[i])
            {
                case '+':
                { //集合当前下标的数值+1
                    middleResult.set(middleIndex, middleResult.get(middleIndex)+1);
                    break;
                }
                case '-':
                { //集合当前下标的数值-1
                    middleResult.set(middleIndex, middleResult.get(middleIndex)-1);
                    break;
                }
                case '[':
                { //设置循环状态码
                    middleFlag.set(middleIndex,1);
                    break;
                }
                case ']':
                { //循环完了之后没有回到[(状态码为1)或者循环条件出界(小于0)，则输入有误
                    if(middleFlag.get(middleIndex)!=1||middleResult.get(middleIndex)<0)
                    {
                        System.out.println("源码错误，我也帮不了你(*^__^*) 嘻嘻……");
                        flag=false;
                    }
                    else
                    { //满足循环条件，回到[,相当于循环的回溯
                        if(middleResult.get(middleIndex)>0)
                        {
                            int count=1;
                            while(count!=0)
                            {
                                i--;
                                if(i<0)
                                {
                                    i=len;
                                    break;
                                }
                                if(interpreter[i]=='[')count--;
                                else if(interpreter[i]==']')count++;
                            }
                        }else{
                            //取消循环状态码
                            middleFlag.set(middleIndex,0);
                        }
                    }
                    break;
                }
                case '.':
                { //存储最后的ASCALL结果
                    if(middleResult.get(middleIndex)<0)
                    {
                        System.out.println("源码解析错误，ASCALL要为整数(*^__^*) 嘻嘻……");
                        flag=false;
                    }
                    else
                    {
                        finallyResult.add(middleResult.get(middleIndex));
                    }
                    break;
                }
                case '>':
                { ////集合下标右移，如果超出集合范围，扩大集合大小
                    middleIndex++;
                    if(middleIndex>=middleResult.size())
                    {
                        middleResult.add(0);
                        middleFlag.add(0);
                    }
                    break;
                }
                case '<':
                { //集合下标左移
                    middleIndex--;
                    if(middleIndex<0)
                    {
                        System.out.println("左移过界，我也帮不了你(*^__^*) 嘻嘻……");
                        flag=false;
                    }
                    break;
                }
                default:
                { //转化失败
                    flag=false;
                    System.out.println("输入含有其他字符，我也帮不了你(*^__^*) 嘻嘻……");
                    break;
                }
            }
            if(flag==false)i=len;//跳出循环
        }
        if(flag==true)
        {
            System.out.print("解析的结果为：");
            //将解析结果以char[]类型输出
            for (Integer li : finallyResult)
            {
                System.out.print((char)(li-0));
            }
        }
    }
}
