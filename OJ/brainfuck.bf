class BrainfuckInt
    attr_accessor :code, :mem_limit, :memory, :buffer, :mem_ptr, :pc
    def initialize(path)
        @code = File.read(path).split('').select{|c| valid?(c)}
        if !bracket_match?
            print "Error: Unmatched brackets\n"
            exit 1
        end
        @mem_limit = 32 * 1024          # default memory size is 32KB
        @memory = Array.new(@mem_limit, 0)
        @pc = 0
        @mem_ptr = 0
        @buffer = ''
    end

    def parse()
        while @pc < @code.length
            if @code[@pc] == '+'
                increment
            elsif @code[@pc] == '-'
                decrement
            elsif @code[@pc] == '<'
                backward
            elsif @code[@pc] == '>'
                forward
            elsif @code[@pc] == '.'
                display
            elsif @code[@pc] == ','
                read
            elsif @code[@pc] == '['
                enter_loop
            elsif @code[@pc] == ']'
                exit_loop
            else
                print "Invalid character: " + @code[@pc] + "\n"
                exit 1
            end
        end
    end

private
    def increment()
        @memory[@mem_ptr] = (@memory[@mem_ptr] + 1) % 256
        next_pc
    end

    def decrement()
        @memory[@mem_ptr] = (@memory[@mem_ptr] - 1 + 256) % 256
        next_pc
    end

    def read()
        @memory[@mem_ptr] = get_char().ord
        next_pc
    end

    def display()
        print @memory[@mem_ptr].chr
        next_pc
    end

    def forward()
        @mem_ptr += 1
        if @mem_ptr >= @mem_limit
            print "Access Violation\n"
            exit 1
        end
        next_pc
    end

    def backward()
        @mem_ptr -= 1
        if @mem_ptr < 0
            print "Access Violation\n"
            exit 1
        end
        next_pc
    end

    def enter_loop()
        if @memory[@mem_ptr] == 0
            cnt = 1
            next_pc
            while cnt > 0
                if @code[@pc] == '['
                    cnt += 1
                elsif @code[@pc] == ']'
                    cnt -= 1
                    if cnt == 0
                        break
                    end
                end
                next_pc
            end
        end
        next_pc
    end

    def exit_loop()
        if @memory[@mem_ptr] != 0
            cnt = 1
            @pc -= 1
            while cnt > 0
                if @code[@pc] == ']'
                    cnt += 1
                elsif @code[@pc] == '['
                    cnt -= 1
                    if cnt == 0
                        break
                    end
                end
                @pc -= 1
            end
        end
        next_pc
    end

    def next_pc()
        @pc += 1
    end

    def valid?(ch)
        ['+', '-', '<', '>', '.', ',', '[', ']'].index(ch) != nil
    end

    def bracket_match?()
        cnt, i = 0, 0
        while i < @code.length
            if @code[i] == '['
                cnt += 1
            elsif @code[i] == ']'
                cnt -= 1
            end
            if cnt < 0
                return false
            end
            i += 1
        end
        true
    end

    def get_char()
        while @buffer == nil or @buffer.length == 0
            @buffer = STDIN.gets
        end
        next_char = @buffer[0]
        @buffer = @buffer[1, @buffer.length]
        next_char
    end
end

def help()
    print "Usage: \n\truby ./bf.rb example.bf\n"
end

if __FILE__ == $0
    if ARGV.length != 1
        help
        exit 1
    end
    path = ARGV[0]
    if not File.file?(path)
        print "Invalid path: " + path + "\n"
        exit 1
    end

    interpreter = BrainfuckInt.new(path)
    interpreter.parse
end
