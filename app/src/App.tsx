import { useState, useCallback, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  RefreshCw, 
  Zap, 
  Shield, 
  BarChart3,
  Type,
  AlignLeft,
  Settings2,
  Download,
  RotateCcw,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { humanizeText, calculateHumanScore, getWordCount, getCharCount, type HumanizeMode } from '@/lib/humanizer';
import { cn } from '@/lib/utils';

const modes: { id: HumanizeMode; label: string; description: string; icon: React.ElementType }[] = [
  { 
    id: 'casual', 
    label: 'Casual', 
    description: 'Conversational, friendly tone with contractions and fillers',
    icon: Type 
  },
  { 
    id: 'professional', 
    label: 'Professional', 
    description: 'Business-appropriate with natural flow',
    icon: Shield 
  },
  { 
    id: 'academic', 
    label: 'Academic', 
    description: 'Scholarly tone with improved readability',
    icon: BarChart3 
  },
  { 
    id: 'creative', 
    label: 'Creative', 
    description: 'Expressive, engaging with varied expressions',
    icon: Sparkles 
  },
];

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<HumanizeMode>('casual');
  const [intensity, setIntensity] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [humanScore, setHumanScore] = useState(0);
  const [showStats, setShowStats] = useState(true);

  // Calculate stats
  const inputWords = getWordCount(inputText);
  const inputChars = getCharCount(inputText);
  const outputWords = getWordCount(outputText);
  const outputChars = getCharCount(outputText);

  // Humanize text
  const handleHumanize = useCallback(() => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to humanize');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay for effect
    setTimeout(() => {
      const result = humanizeText(inputText, { mode, intensity });
      setOutputText(result);
      setHumanScore(calculateHumanScore(result));
      setIsProcessing(false);
      toast.success('Text humanized successfully!');
    }, 800);
  }, [inputText, mode, intensity]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, [outputText]);

  // Clear all text
  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setHumanScore(0);
    toast.info('Text cleared');
  }, []);

  // Reset to original
  const handleReset = useCallback(() => {
    if (inputText) {
      setOutputText('');
      setHumanScore(0);
      toast.info('Reset to original');
    }
  }, [inputText]);

  // Download as text file
  const handleDownload = useCallback(() => {
    if (!outputText) return;
    
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `humanized-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  }, [outputText]);

  // Quick paste example
  const loadExample = useCallback(() => {
    const example = `The utilization of artificial intelligence has become increasingly prevalent in modern society. Furthermore, organizations are leveraging machine learning algorithms to optimize their operational efficiency and enhance productivity. Consequently, this technological advancement facilitates the automation of repetitive tasks and enables employees to focus on more strategic initiatives.`;
    setInputText(example);
    toast.info('Example loaded!');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleHumanize();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && outputText && document.activeElement?.tagName !== 'TEXTAREA') {
        handleCopy();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleHumanize, handleCopy, outputText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-50" />
              <div className="relative bg-slate-900 rounded-xl p-2.5">
                <Sparkles className="w-6 h-6 text-violet-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                AI Humanizer Pro
              </h1>
              <p className="text-xs text-slate-400">Transform AI text into human writing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStats(!showStats)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle stats</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Badge variant="outline" className="border-violet-500/30 text-violet-300 bg-violet-500/10">
              <Zap className="w-3 h-3 mr-1" />
              Free Forever
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Select Mode</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  'relative group p-4 rounded-xl border transition-all duration-300 text-left',
                  mode === m.id
                    ? 'border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg transition-colors',
                    mode === m.id ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-800 text-slate-400'
                  )}>
                    <m.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={cn(
                      'font-medium text-sm',
                      mode === m.id ? 'text-violet-300' : 'text-slate-300'
                    )}>
                      {m.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {m.description}
                    </div>
                  </div>
                </div>
                {mode === m.id && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-violet-500/30 ring-inset" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        <Card className="mb-8 border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">Humanization Intensity</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-slate-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Higher intensity applies more aggressive transformations. Start with 70% for best results.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  'font-mono',
                  intensity < 40 ? 'border-blue-500/30 text-blue-300' :
                  intensity < 70 ? 'border-amber-500/30 text-amber-300' :
                  'border-rose-500/30 text-rose-300'
                )}
              >
                {intensity}%
              </Badge>
            </div>
            <Slider
              value={[intensity]}
              onValueChange={([value]) => setIntensity(value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Subtle</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </CardContent>
        </Card>

        {/* Text Areas */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Input Text</span>
              </div>
              <div className="flex items-center gap-2">
                {showStats && (
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{inputWords} words</span>
                    <span>{inputChars} chars</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadExample}
                  className="text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                >
                  Load Example
                </Button>
              </div>
            </div>
            <div className="relative">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your AI-generated text here..."
                className="min-h-[400px] resize-none bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-violet-500/20 rounded-xl"
              />
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-slate-300">Humanized Output</span>
              </div>
              <div className="flex items-center gap-2">
                {showStats && outputText && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500">Human Score:</span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'font-mono text-xs',
                          humanScore >= 80 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                          humanScore >= 60 ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                          'border-rose-500/30 text-rose-400 bg-rose-500/10'
                        )}
                      >
                        {humanScore}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{outputWords} words</span>
                      <span>{outputChars} chars</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <Textarea
                value={outputText}
                readOnly
                placeholder="Humanized text will appear here..."
                className="min-h-[400px] resize-none bg-slate-900/30 border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-xl"
              />
              {outputText && (
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                    title="Download as file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                    title="Reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleHumanize}
            disabled={isProcessing || !inputText.trim()}
            size="lg"
            className={cn(
              'relative group min-w-[200px] h-14 text-base font-semibold rounded-xl transition-all duration-300',
              'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500',
              'shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
            )}
          >
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Humanizing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Humanize Text
              </>
            )}
          </Button>
          
          <Button
            onClick={handleClear}
            variant="outline"
            size="lg"
            className="min-w-[140px] h-14 text-base rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            Press <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-400 font-mono text-xs">Ctrl/⌘ + Enter</kbd> to humanize
            {outputText && (
              <>
                {' '}• Press <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-400 font-mono text-xs">Ctrl/⌘ + C</kbd> to copy
              </>
            )}
          </p>
        </div>

        {/* Features */}
        <Separator className="my-12 bg-slate-800" />
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Bypass AI Detectors</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Advanced algorithms transform AI patterns into natural human writing that evades detection systems.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Lightning Fast</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Process thousands of words instantly with our optimized local algorithms. No API calls needed.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 mb-4">
              <Settings2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Multiple Modes</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Choose from Casual, Professional, Academic, or Creative modes to match your writing style.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <Separator className="my-12 bg-slate-800" />
        
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-200 mb-8">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Paste AI Text', desc: 'Copy and paste your AI-generated content into the input field.' },
              { step: 2, title: 'Choose Settings', desc: 'Select your preferred mode and adjust the humanization intensity.' },
              { step: 3, title: 'Humanize', desc: 'Click the button and watch your text transform in seconds.' },
              { step: 4, title: 'Copy & Use', desc: 'Copy the humanized text and use it anywhere with confidence.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">{item.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500">
            AI Humanizer Pro • Transform AI text into natural human writing
          </p>
          <p className="text-xs text-slate-600 mt-2">
            100% Free • No API Keys • No Registration Required
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
